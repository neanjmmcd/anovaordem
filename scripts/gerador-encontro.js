/* =========================
 * GERADOR DE ENCONTRO ALEATÓRIO
 * Sorteia ameaças do Bestiário até o orçamento do Suplemento
 * (personagens × base da experiência × multiplicador da dificuldade)
 * e coloca os tokens na cena, ocultos, para o mestre revelar.
 * ========================= */

import { AMEACA_POR_TIER } from "./npc-model.js";

const PACK = "a-nova-ordem.bestiario";
const MAX_TOKENS = 12;

export const DIFICULDADES = {
  facil: { label: "Fácil", mult: 0.5 },
  normal: { label: "Normal", mult: 1 },
  dificil: { label: "Difícil", mult: 1.5 },
  mortal: { label: "Mortal", mult: 2 }
};

export const TEMAS = {
  todos: "Qualquer",
  urbano: "Urbano (ruas e guetos)",
  militar: "Militar (Império)",
  oculto: "Oculto",
  mecanico: "Máquinas"
};

/* Temas de cada ameaça pelo início do nome; quem não está aqui (Cidadão Comum, Canal) não é sorteado */
const TEMAS_NPC = [
  ["Bandido Comum", ["urbano"]],
  ["Força de Segurança", ["urbano", "militar", "oculto"]],
  ["Guarda do Depósito", ["urbano", "militar"]],
  ["Errante Irradiado", ["urbano", "oculto"]],
  ["Vespa de Chumbo", ["militar", "mecanico"]],
  ["Mercenário Veterano", ["urbano", "militar"]],
  ["Cão de Guerra", ["militar", "mecanico"]],
  ["Inquisidor Ocultista", ["oculto", "militar"]],
  ["Centurião Mecanizado", ["militar", "mecanico"]],
  ["Espreitador do Abismo", ["oculto"]],
  ["Guardião de Aço", ["militar", "mecanico"]],
  ["Projeto Gólgota", ["militar", "mecanico"]],
  ["Mecha Tripulado", ["militar", "mecanico"]]
];

/* Tier mais alto que pode aparecer para cada experiência */
const TIER_MAX = { novatos: 3, calejados: 3, veteranos: 4, lendas: 4 };

const sortear = lista => lista[Math.floor(Math.random() * lista.length)];

async function candidatos(tema, exp, alvo) {
  const pack = game.packs.get(PACK);
  if (!pack) return [];
  const indice = await pack.getIndex({ fields: ["system.tier", "img"] });
  const out = [];
  for (const e of indice) {
    const temas = TEMAS_NPC.find(([nome]) => e.name.startsWith(nome))?.[1];
    if (!temas || (tema !== "todos" && !temas.includes(tema))) continue;
    const tier = Number(e.system?.tier ?? 0);
    const ameaca = AMEACA_POR_TIER[tier] ?? 1;
    if (tier > (TIER_MAX[exp] ?? 4) || ameaca > alvo) continue;
    out.push({ uuid: e.uuid, id: e._id, nome: e.name, img: e.img, tier, ameaca });
  }
  return out;
}

/** Monta o encontro: um líder (o mais forte que cabe em ~60% do orçamento) e capangas até completar */
export async function gerarEncontro({ pjs, base, exp, dificuldade, tema }) {
  const alvo = Math.max(1, Math.round(pjs * base * (DIFICULDADES[dificuldade]?.mult ?? 1)));
  const pool = await candidatos(tema, exp, alvo);
  if (!pool.length) return null;

  const escolhidos = new Map();
  const somar = c => {
    const atual = escolhidos.get(c.uuid) ?? { ...c, qtd: 0 };
    atual.qtd++;
    escolhidos.set(c.uuid, atual);
  };

  const teto = Math.max(Math.min(...pool.map(c => c.ameaca)), alvo * 0.6);
  const lideres = pool.filter(c => c.ameaca <= teto);
  const maior = Math.max(...lideres.map(c => c.ameaca));
  const lider = sortear(lideres.filter(c => c.ameaca >= maior / 2));
  somar(lider);
  let resto = alvo - lider.ameaca;
  let tokens = 1;

  // Capangas: no máximo 2 tipos diferentes além do líder, repetidos até o orçamento
  const tipos = [];
  while (tokens < MAX_TOKENS) {
    let cabem = pool.filter(c => c.ameaca <= resto && c.ameaca <= lider.ameaca);
    if (!cabem.length) break;
    // orçamento grande para poucos tokens restantes: prefere capangas mais fortes
    const fortes = cabem.filter(c => c.ameaca * (MAX_TOKENS - tokens) >= resto);
    if (fortes.length) cabem = fortes;
    const repetiveis = tipos.filter(t => t.ameaca <= resto);
    const c = (repetiveis.length && (tipos.length >= 2 || Math.random() < 0.6)) ? sortear(repetiveis) : sortear(cabem);
    if (!tipos.includes(c)) tipos.push(c);
    somar(c);
    resto -= c.ameaca;
    tokens++;
  }

  const lista = [...escolhidos.values()].sort((a, b) => b.ameaca - a.ameaca);
  const total = lista.reduce((t, c) => t + c.ameaca * c.qtd, 0);
  return { alvo, total, lista, dificuldade: DIFICULDADES[dificuldade]?.label ?? "Normal", tema: TEMAS[tema] ?? TEMAS.todos };
}

/** Resumo só para o mestre */
export async function encontroNoChat(enc) {
  const linhas = enc.lista.map(c => `<li>${c.qtd}× <b>${c.nome}</b> <small>(Tier ${c.tier}, Ameaça ${c.ameaca})</small></li>`).join("");
  await ChatMessage.create({
    speaker: { alias: "Gerador de Encontro" },
    whisper: ChatMessage.getWhisperRecipients("GM").map(u => u.id),
    content: `<div class="aon-encontro-chat"><b>Encontro ${enc.dificuldade}</b> · ${enc.tema}<ul>${linhas}</ul>`
      + `Ameaça <b>${enc.total}</b> de ${enc.alvo}</div>`
  });
}

/** Importa as ameaças para a aba Atores (uma vez) e cria os tokens ocultos no centro da tela */
export async function colocarNaCena(enc) {
  const cena = canvas.scene;
  if (!cena) return ui.notifications.warn("Abra uma cena antes.");
  const pack = game.packs.get(PACK);
  let pasta = game.folders.find(f => f.type === "Actor" && f.name === "Encontros");
  pasta ??= await Folder.implementation.create({ name: "Encontros", type: "Actor" });

  const gs = canvas.grid.size;
  const centro = canvas.stage.pivot;
  const porLinha = 4;
  const dados = [];
  let i = 0;
  for (const c of enc.lista) {
    let actor = game.actors.find(a => a._stats?.compendiumSource === c.uuid || a.getFlag("core", "sourceId") === c.uuid);
    actor ??= await game.actors.importFromCompendium(pack, c.id, { folder: pasta.id });
    for (let n = 0; n < c.qtd; n++, i++) {
      const col = i % porLinha, lin = Math.floor(i / porLinha);
      const pos = canvas.grid.getTopLeftPoint({
        x: centro.x + (col - porLinha / 2) * gs * 1.5,
        y: centro.y + (lin - 1) * gs * 1.5
      });
      const td = await actor.getTokenDocument({ x: pos.x, y: pos.y, hidden: true });
      dados.push(td.toObject());
    }
  }
  await cena.createEmbeddedDocuments("Token", dados);
  ui.notifications.info(`${dados.length} token(s) colocados na cena, ocultos. Revele pelo painel ou pelo HUD.`);
}
