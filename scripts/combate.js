/* =========================
 * AUTOMAÇÃO DE COMBATE
 * Ataque (perícia da arma) → esquiva do alvo → dano − RD → estado de Saúde.
 * Tudo configurável pelo mestre em Configurações → "Automação de Combate".
 * Jogadores não podem alterar atores que não são deles: nesses casos o
 * pedido vai pelo socket do sistema e o mestre ativo aplica.
 * ========================= */

import { status } from "./rolls.js";
import { cartao, enviarCartao, corDoGrau, CORES, textoAlvos } from "./cartao.js";

const SISTEMA = "a-nova-ordem";
const SOCKET = `system.${SISTEMA}`;
const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export const COMBATE_PADRAO = {
  ativo: true,             // desligado = só botões de dano/cura no chat, nada automático
  rolarAtaque: true,       // rolar a perícia da arma antes do dano
  esquiva: "botao",        // "nenhuma" | "botao" (o dono do alvo decide) | "automatica"
  aplicarDano: "automatico", // "automatico" | "botao" (alguém clica para aplicar)
  consumirMunicao: true,   // −1 munição por ataque
  criticoDobra: true,      // crítico (01–04) dobra os dados de dano
  ocultarRolagemMestre: false // jogadores veem só sucesso/falha/crítico das rolagens do mestre
};

export function config() {
  return { ...COMBATE_PADRAO, ...(game.settings.get(SISTEMA, "combate") ?? {}) };
}

const PERICIAS_CORPO_A_CORPO = ["armasBrancas", "briga"];

const PENALIDADES = ["penfisica", "pensociais", "penmentais", "pentecnicologica", "penaquimica", "penmagica", "pensobrevivencia"];

/* =========================
 * TESTES
 * ========================= */

/** Grau do resultado no d100 */
export function grau(resultado, alvo) {
  if (resultado <= 4) return { sucesso: true, critico: true, texto: "💥 SUCESSO CRÍTICO 💥" };
  if (resultado >= 96) return { sucesso: false, critico: true, texto: "💀 FALHA CRÍTICA 💀" };
  if (resultado <= alvo) return { sucesso: true, critico: false, texto: "✅ Sucesso ✅" };
  return { sucesso: false, critico: false, texto: "❌ Falha ❌" };
}

/**
 * Chance de uma perícia para personagem ou NPC, usando o melhor atributo.
 * Personagem: perícia + bônus + itens + atributo − penalidade do grupo.
 * NPC: perícia destacada (ou valor do grupo) + atributo − penalidade de Saúde.
 */
export function chancePericia(actor, key) {
  const cfg = CONFIG.AONOVAORDEM.pericias[key];
  if (!cfg || !actor) return { alvo: 0, atributo: "", texto: "" };
  const sys = actor.system;
  const atrs = sys.atributosTotais ?? sys.atributos ?? {};
  const atributo = cfg.atributos.reduce((a, b) => (Number(atrs[b] ?? 0) > Number(atrs[a] ?? 0) ? b : a));
  const valorAtr = Number(atrs[atributo] ?? 0);

  let pericia, pen;
  if (actor.type === "npc") {
    pericia = actor.system.valorPericia(key);
    pen = Number(sys.penSaude ?? 0);
  } else {
    const p = sys.pericias?.[key] ?? {};
    pericia = Number(p.valor ?? 0) + Number(p.bonus ?? 0) + Number(sys.periciasItens?.[key] ?? 0);
    pen = Number(sys.penalidadesTotais?.[cfg.penalidade] ?? sys.penalidades?.[cfg.penalidade] ?? 0);
  }
  let alvo = valorAtr + pericia - pen;
  if (sys.metadeSociais && cfg.penalidade === "pensociais") alvo = Math.floor(alvo / 2);
  return {
    alvo, atributo,
    texto: `${cfg.label} ${pericia}% + ${atributo.toUpperCase()} ${valorAtr}${pen ? ` − ${pen}` : ""} = <b>${alvo}%</b>`
  };
}

/** Teste simples de perícia (melhor atributo) com cartão no chat */
export async function rolarTeste(actor, key) {
  const chance = chancePericia(actor, key);
  const roll = await new Roll("1d100").evaluate();
  const g = grau(roll.total, chance.alvo);
  return enviarCartao({
    actor, rolls: [roll],
    html: cartao({
      img: actor.img, titulo: CONFIG.AONOVAORDEM.pericias[key]?.label ?? key,
      subtitulo: actor.name + textoAlvos([...game.user.targets].map(t => t.actor)),
      calculo: `${chance.texto} · d100 = <b>${roll.total}</b>`,
      resultado: `<b>${g.texto}</b>`, cor: corDoGrau(g)
    })
  });
}

/** Perícia usada pela arma: a escolhida na ficha da arma ou um palpite pelo nome/dano */
export function periciaDaArma(item) {
  if (item.system.pericia) return item.system.pericia;
  const t = `${item.name} ${item.system.tipo ?? ""} ${item.system.dano ?? ""}`.toLowerCase();
  if (/experiment|voltaic|tesla/.test(t)) return "armasExperimentais";
  if (/pesad|canh[aã]o|foguete|morteiro|gatling|lan[çc]a-chamas/.test(t)) return "armasPesadas";
  if (/granada|dinamite/.test(t)) return "atletismo";
  if (/soco|punho|soqueira/.test(t)) return "briga";
  if (/\+\s*for\b|l[aâ]mina|faca|espada|machado|bast[aã]o|katana|adaga|porrete|cassetete/.test(t)) return "armasBrancas";
  return "armasFogo";
}

/** "2d6 + FOR / cortante" → { formula: "2d6", atributo: "for", atributoValor } */
export function prepararDano(texto, actor) {
  if (!texto) return null;
  const [principal] = String(texto).split("/");
  const formula = principal.match(/(\d+d\d+(?:\s*[+-]\s*\d+(?!d))?)/i) ?? principal.match(/^\s*(\d+)\s*$/);
  if (!formula) return null;
  const atr = principal.match(/\+\s*(for|des|con|int|sab|psi|car)\b/i);
  const atributo = atr ? atr[1].toLowerCase() : "";
  const atrs = actor?.system.atributosTotais ?? actor?.system.atributos ?? {};
  return { formula: formula[1].replace(/\s+/g, ""), atributo, atributoValor: atributo ? Number(atrs[atributo] ?? 0) : 0 };
}

/* =========================
 * ATAQUE COMPLETO
 * ========================= */
export async function atacar(actor, item) {
  const cfg = config();
  const alvos = [...game.user.targets].map(t => t.actor).filter(Boolean);

  // Só armas de disparo/arremesso usam munição; corpo-a-corpo (Armas Brancas, Briga) não gasta
  if (item.type === "arma" && "ammo" in item.system && !PERICIAS_CORPO_A_CORPO.includes(periciaDaArma(item))) {
    if (Number(item.system.ammo) < 1) return ui.notifications.warn("Sem munição na arma.");
    if (cfg.ativo && cfg.consumirMunicao) await item.update({ "system.ammo": Number(item.system.ammo) - 1 });
  }

  const dano = prepararDano(item.system.dano, actor);
  if (!dano) return ui.notifications.warn(`Dano inválido em ${item.name}.`);

  // Sem automação ou sem teste de ataque: só o dano (comportamento antigo)
  let ataque = null;
  if (cfg.ativo && cfg.rolarAtaque && item.type === "arma") {
    const key = periciaDaArma(item);
    const chance = chancePericia(actor, key);
    const roll = await new Roll("1d100").evaluate();
    ataque = { roll, chance, ...grau(roll.total, chance.alvo) };
  }

  let formula = dano.formula;
  if (ataque?.sucesso && ataque.critico && cfg.criticoDobra) {
    formula = formula.replace(/^(\d+)d/i, (_, n) => `${Number(n) * 2}d`);
  }

  const rolls = ataque ? [ataque.roll] : [];
  let danoRoll = null, total = 0;
  if (!ataque || ataque.sucesso) {
    danoRoll = await new Roll(formula).evaluate();
    rolls.push(danoRoll);
    total = danoRoll.total + dano.atributoValor;
  }

  // Cálculo (oculto para os jogadores quando o mestre rola com "ocultar")
  let calculo = "";
  if (ataque) calculo += `Ataque: ${ataque.chance.texto} · d100 = <b>${ataque.roll.total}</b><br>`;
  if (danoRoll) {
    calculo += `Dano: ${formula}${dano.atributo ? ` + ${dano.atributo.toUpperCase()} (${dano.atributoValor})` : ""}`
      + ` = <b>${total}</b>${formula !== dano.formula ? " (crítico: dados dobrados)" : ""}`;
  }

  // Alvos
  const pendentes = [];
  let extra = "";
  if (danoRoll && cfg.ativo && alvos.length) {
    for (const alvo of alvos) {
      const bloco = await resolverAlvo(alvo, total, cfg);
      extra += bloco.html;
      if (bloco.pendente) pendentes.push(bloco.pendente);
    }
  } else if (danoRoll) {
    extra += botoesDanoCura(total);
  }

  const html = cartao({
    img: item.img,
    titulo: item.name,
    subtitulo: actor.name + textoAlvos(alvos),
    calculo,
    resultado: ataque ? `<b>${ataque.texto}</b>` : `<b>Dano rolado</b>`,
    cor: ataque ? corDoGrau(ataque) : CORES.dano,
    extra
  });
  const msg = await enviarCartao({ actor, html, rolls, flags: { pendentes } });
  // Dano automático sem esquiva pendente: aplica já
  for (const p of pendentes.filter(p => p.aplicarJa)) {
    await pedir("dano", { uuid: p.uuid, dano: p.dano, messageId: msg.id });
  }
}

/** Bloco de um alvo dentro do cartão de ataque */
function blocoAlvo(alvo, calculo, resultado, botoes = "") {
  return `<div class="aon-alvo" data-alvo="${alvo.uuid}">
    <div class="aon-alvo-nome"><img src="${alvo.img}"> <b>${alvo.name}</b></div>
    ${calculo ? `<div class="aon-calculo">${calculo}</div>` : ""}
    ${resultado ? `<div class="aon-alvo-res">${resultado}</div>` : ""}
    ${botoes}
  </div>`;
}

/** Monta o bloco de cada alvo conforme a configuração de esquiva/aplicação */
async function resolverAlvo(alvo, total, cfg) {
  const rd = Number(alvo.system.rd ?? 0);
  const efetivo = Math.max(1, total - rd); // todo acerto causa no mínimo 1 (livro)

  if (cfg.esquiva === "automatica") {
    const chance = chancePericia(alvo, "esquiva");
    const r = await new Roll("1d100").evaluate();
    const g = grau(r.total, chance.alvo);
    const calc = `Esquiva: ${chance.texto} · d100 = <b>${r.total}</b>`;
    if (g.sucesso) return { html: blocoAlvo(alvo, calc, `<b>Esquivou!</b>`) };
    return blocoDano(alvo, calc + "<br>", efetivo, rd, total, cfg, "Não esquivou. ");
  }
  if (cfg.esquiva === "botao") {
    return {
      html: blocoAlvo(alvo, `RD ${rd} · dano após RD: <b>${efetivo}</b>`, "",
        `<div class="aon-botoes" data-uuid="${alvo.uuid}">
          <button type="button" class="aon-esquivar" data-uuid="${alvo.uuid}" data-dano="${efetivo}"><i class="fas fa-person-running"></i> Esquivar</button>
          <button type="button" class="aon-receber" data-uuid="${alvo.uuid}" data-dano="${efetivo}"><i class="fas fa-heart-crack"></i> Receber</button>
        </div>`)
    };
  }
  return blocoDano(alvo, "", efetivo, rd, total, cfg);
}

function blocoDano(alvo, calc, efetivo, rd, total, cfg, prefixo = "") {
  const conta = `${calc}${total} − RD ${rd} = <b style="color:red">${efetivo}</b>`;
  if (cfg.aplicarDano === "automatico") {
    return {
      html: blocoAlvo(alvo, conta, prefixo ? prefixo : ""),
      pendente: { uuid: alvo.uuid, dano: efetivo, aplicarJa: true }
    };
  }
  return {
    html: blocoAlvo(alvo, conta, prefixo,
      `<div class="aon-botoes"><button type="button" class="aon-receber" data-uuid="${alvo.uuid}" data-dano="${efetivo}">
      <i class="fas fa-heart-crack"></i> Aplicar dano</button></div>`)
  };
}

export function botoesDanoCura(total) {
  return `<p>
    <button class="aplicar-dano" data-dano="${total}" title="Aplicar dano (− RD) no token selecionado ou no alvo"><b>-</b></button>
    <b>Total: ${total}</b>
    <button class="aplicar-cura" data-cura="${total}" title="Aplicar cura no token selecionado ou no alvo"><b>+</b></button></p>`;
}

/* =========================
 * DANO E CURA (executados por quem tem permissão)
 * ========================= */

/** Saúde nova → atualização do ator (personagem grava as penalidades; NPC calcula sozinho) */
function atualizacaoSaude(actor, saude) {
  const upd = { "system.saude": saude };
  if (actor.type === "personagem") {
    const [, pen] = status(saude);
    for (const k of PENALIDADES) upd[`system.penalidades.${k}`] = pen;
  }
  return upd;
}

function estadoSaude(actor) {
  return actor.type === "npc" ? actor.system.estadoSaude : status(Number(actor.system.saude ?? 0))[0];
}

async function executarDano(actor, dano) {
  const saude = Math.max(0, Number(actor.system.saude ?? 0) - dano);
  await actor.update(atualizacaoSaude(actor, saude));
  return estadoSaude(actor);
}

async function executarCura(actor, cura) {
  const max = actor.type === "npc" ? Number(actor.system.saudeMax ?? 100) : 100;
  const saude = Math.min(max, Number(actor.system.saude ?? 0) + cura);
  await actor.update(atualizacaoSaude(actor, saude));
  return estadoSaude(actor);
}

/** Marca o bloco do alvo no cartão como resolvido */
async function resolverBloco(messageId, uuid, texto) {
  const msg = game.messages.get(messageId);
  if (!msg) return;
  const div = document.createElement("div");
  div.innerHTML = msg.content;
  const bloco = div.querySelector(`.aon-alvo[data-alvo="${uuid}"]`);
  if (!bloco) return;
  bloco.querySelector(".aon-botoes")?.remove();
  bloco.insertAdjacentHTML("beforeend", `<div class="aon-resolvido">${texto}</div>`);
  await msg.update({ content: div.innerHTML });
}

/** Cartão do chat com o resultado de dano/cura */
function anunciar(actor, texto, cor, estado) {
  ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor }),
    content: cartao({ img: actor.img, titulo: actor.name, calculo: "", resultado: `${texto}<br><b>Status:</b> ${estado}`, cor })
  });
}

const ACOES = {
  // bruto: o valor ainda não teve a RD descontada (botão − do chat)
  async dano({ uuid, dano, messageId, bruto }) {
    const actor = await fromUuid(uuid);
    if (!actor) return;
    const efetivo = bruto ? Math.max(1, Number(dano) - Number(actor.system.rd ?? 0)) : Number(dano);
    const estado = await executarDano(actor, efetivo);
    if (messageId) await resolverBloco(messageId, uuid, `Recebeu <b style="color:red">${efetivo}</b> — <b>${estado}</b>`);
    if (bruto) anunciar(actor, `Reduziu <b style="color:red">${efetivo}</b> na sua Saúde.`, CORES.dano, estado);
    return estado;
  },
  async esquivou({ uuid, messageId }) {
    if (messageId) await resolverBloco(messageId, uuid, `<b>Esquivou!</b>`);
  },
  async cura({ uuid, cura }) {
    const actor = await fromUuid(uuid);
    if (!actor) return;
    const estado = await executarCura(actor, Number(cura));
    anunciar(actor, `Curou <b style="color:Chartreuse">${cura}</b> na sua Saúde.`, CORES.cura, estado);
    return estado;
  }
};

/** Executa aqui se puder; senão pede ao mestre ativo pelo socket */
export async function pedir(acao, dados) {
  const actor = dados.uuid ? await fromUuid(dados.uuid) : null;
  const msg = dados.messageId ? game.messages.get(dados.messageId) : null;
  const podeAqui = game.user.isGM || ((!actor || actor.isOwner) && (!msg || msg.isOwner));
  if (podeAqui) return ACOES[acao](dados);
  if (!game.users.activeGM) return ui.notifications.warn("Nenhum mestre conectado para aplicar o efeito.");
  game.socket.emit(SOCKET, { acao, dados });
}

/* =========================
 * REGISTRO: configuração, socket e botões do chat
 * ========================= */
export function registrarCombate() {
  game.settings.register(SISTEMA, "combate", {
    scope: "world", config: false, type: Object, default: COMBATE_PADRAO
  });
  game.settings.registerMenu(SISTEMA, "combateMenu", {
    name: "Automação de Combate",
    label: "Configurar",
    hint: "Ligar/desligar teste de ataque, esquiva, aplicação de dano, munição e crítico.",
    icon: "fas fa-crosshairs",
    type: ConfigCombate,
    restricted: true
  });
}

Hooks.once("ready", () => {
  game.socket.on(SOCKET, async ({ acao, dados }) => {
    if (!game.users.activeGM?.isSelf) return;
    await ACOES[acao]?.(dados);
  });
});

Hooks.on("renderChatMessageHTML", (message, html) => {
  for (const botao of html.querySelectorAll(".aon-esquivar, .aon-receber")) {
    const actor = fromUuidSync(botao.dataset.uuid);
    // Só o mestre e o dono do alvo decidem
    if (!game.user.isGM && !actor?.isOwner) { botao.closest(".aon-botoes")?.remove(); continue; }
    botao.addEventListener("click", async ev => {
      ev.preventDefault();
      botao.closest(".aon-botoes")?.querySelectorAll("button").forEach(b => (b.disabled = true));
      const { uuid, dano } = botao.dataset;
      if (botao.classList.contains("aon-receber")) {
        return pedir("dano", { uuid, dano: Number(dano), messageId: message.id });
      }
      const alvo = await fromUuid(uuid);
      const chance = chancePericia(alvo, "esquiva");
      const r = await new Roll("1d100").evaluate();
      const g = grau(r.total, chance.alvo);
      await enviarCartao({
        actor: alvo, rolls: [r],
        html: cartao({
          img: alvo.img, titulo: "Esquiva", subtitulo: alvo.name,
          calculo: `${chance.texto} · d100 = <b>${r.total}</b>`,
          resultado: `<b>${g.texto}</b>`, cor: corDoGrau(g)
        })
      });
      if (g.sucesso) return pedir("esquivou", { uuid, messageId: message.id });
      return pedir("dano", { uuid, dano: Number(dano), messageId: message.id });
    });
  }
});

/* =========================
 * JANELA DE CONFIGURAÇÃO
 * ========================= */
class ConfigCombate extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    id: "aon-config-combate",
    tag: "form",
    classes: ["a-nova-ordem", "aon-config-combate"],
    window: { title: "Automação de Combate", icon: "fas fa-crosshairs" },
    position: { width: 480 },
    form: { handler: ConfigCombate.#salvar, closeOnSubmit: true },
    actions: { padrao: ConfigCombate.#padrao }
  };
  static PARTS = { main: { template: "systems/a-nova-ordem/templates/config-combate.hbs" } };

  async _prepareContext() {
    const c = config();
    return {
      c,
      esquivas: { nenhuma: "Sem esquiva", botao: "Botão para o dono do alvo", automatica: "Automática (o sistema rola)" },
      aplicacoes: { automatico: "Automático", botao: "Botão no chat (confirmar)" }
    };
  }

  static async #salvar(event, form, formData) {
    const d = foundry.utils.expandObject(formData.object);
    for (const [k, v] of Object.entries(COMBATE_PADRAO)) {
      if (typeof v === "boolean") d[k] = !!d[k];   // caixa desmarcada não vem no formulário
    }
    await game.settings.set(SISTEMA, "combate", { ...COMBATE_PADRAO, ...d });
    ui.notifications.info("Automação de combate salva.");
  }

  static async #padrao() {
    await game.settings.set(SISTEMA, "combate", COMBATE_PADRAO);
    this.render();
  }
}
