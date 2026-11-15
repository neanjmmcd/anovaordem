/* =========================
 * ATALHOS NA BARRA (hotbar)
 * Arraste uma arma, técnica alquímica, feitiço, ritual, consumível ou item da ficha
 * para a barra de atalhos: o atalho faz o mesmo que o clique na ficha.
 *  - Arma / técnica alquímica → ataque (teste, esquiva, dano − RD) + animação
 *  - Feitiço / ritual → conjuração + animação
 *  - Consumível (droga, elixir, injeção, mutagênico…) → ativa (gasta uma unidade)
 *  - Demais itens → mostra o cartão no chat
 * O atalho guarda o item do personagem; se o item sumir, procura pelo nome no
 * token selecionado ou no personagem do jogador.
 * ========================= */

import { atacar, conjurar } from "./combate.js";

/* Cartão no chat de cada tipo (métodos da ficha de personagem) */
const MOSTRAR = {
  items: "_onMostrarItem", armadura: "_onMostrarArmadura", arma: "_onMostrarArma",
  alquimico: "_onMostrarAlquimico", drogas: "_onMostrarDroga", implantes: "_onMostrarImplante",
  magias: "_onMostrarMagia", rituais: "_onMostrarRitual", veiculo: "_onMostrarVeiculo",
  mecha: "_onMostrarMecha", alquimia: "_onMostrarAlquimia", acidos: "_onMostrarAcido",
  venenos: "_onMostrarVeneno", injecoes: "_onMostrarInjecao", elixires: "_onMostrarElixir",
  mutagenicos: "_onMostrarMutagenico"
};

/** Acha o item do atalho: pelo uuid salvo ou, se não existir mais, pelo nome no ator atual */
async function acharItem(uuid, nome) {
  const salvo = uuid ? await fromUuid(uuid).catch(() => null) : null;
  if (salvo?.parent?.documentName === "Actor") return salvo;
  const ator = canvas.tokens?.controlled[0]?.actor ?? game.user.character;
  return ator?.items.find(i => i.name === nome) ?? null;
}

/** Usa o item como o clique na ficha faria */
export async function usarItem(uuid, nome) {
  const item = await acharItem(uuid, nome);
  if (!item) return ui.notifications.warn(`Item "${nome}" não encontrado: selecione o token do personagem que o possui.`);
  const actor = item.parent;
  if (!actor.isOwner) return ui.notifications.warn(`Você não controla ${actor.name}.`);

  if (item.type === "arma" || item.type === "alquimico") {
    await atacar(actor, item);
    return window.tocarAnimacao?.(actor, item);
  }
  if (item.type === "magias" || item.type === "rituais") {
    await conjurar(actor, item);
    return window.tocarAnimacao?.(actor, item, { noProprio: item.type === "rituais" });
  }
  if ("ativo" in item.system) {
    if (item.system.ativo) return ui.notifications.info(`${item.name} já está ativo.`);
    await item.update({ "system.ativo": true });
    if (item.system.ativo) window.tocarAnimacao?.(actor, item, { noProprio: true });
    return;
  }
  const metodo = MOSTRAR[item.type];
  const ficha = actor.sheet;
  if (metodo && typeof ficha?.[metodo] === "function") {
    return ficha[metodo]({ preventDefault() {}, currentTarget: { dataset: { itemId: item.id } } });
  }
  return item.sheet.render(true);
}

/** Cria (ou reaproveita) a macro do item e põe no espaço da barra */
async function criarAtalho(data, slot) {
  const item = await Item.implementation.fromDropData(data);
  if (!item) return;
  if (item.parent?.documentName !== "Actor") {
    return ui.notifications.warn("Arraste o item a partir da ficha do personagem.");
  }
  const command = `game.aonovaordem.usarItem(${JSON.stringify(item.uuid)}, ${JSON.stringify(item.name)});`;
  let macro = game.macros.find(m => m.command === command && m.isOwner);
  if (!macro) {
    macro = await Macro.implementation.create({
      name: item.name,
      type: "script",
      img: item.img,
      command,
      flags: { "a-nova-ordem": { itemUuid: item.uuid } }
    });
  }
  if (macro) await game.user.assignHotbarMacro(macro, slot);
}

export function registrarAtalhos() {
  Hooks.on("hotbarDrop", (_bar, data, slot) => {
    if (data?.type !== "Item") return;
    criarAtalho(data, slot).catch(err => console.error("A Nova Ordem | Falha ao criar atalho:", err));
    return false;
  });
}
