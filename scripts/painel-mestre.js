/* =========================
 * PAINEL DO MESTRE
 * Tokens da cena atual: personagens e ameaças com Saúde, estado e RD,
 * dano/cura rápidos, alvo, ficha e o orçamento de encontro do Suplemento.
 * Abre pelo botão nos controles de token (só o mestre).
 * ========================= */

import { pedir } from "./combate.js";
import { status } from "./rolls.js";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

const EXPERIENCIA = {
  novatos: { label: "Novatos (0 missões)", base: 3 },
  calejados: { label: "Calejados (1–3)", base: 4 },
  veteranos: { label: "Veteranos (4–8)", base: 6 },
  lendas: { label: "Lendas da Resistência (9+)", base: 8 }
};

export class AONovaOrdemPainelMestre extends HandlebarsApplicationMixin(ApplicationV2) {

  static DEFAULT_OPTIONS = {
    id: "aon-painel-mestre",
    classes: ["a-nova-ordem", "aon-painel"],
    window: { title: "Painel do Mestre", icon: "fas fa-chess-rook", resizable: true },
    position: { width: 640, height: 680 },
    actions: {
      ficha: AONovaOrdemPainelMestre.#ficha,
      focar: AONovaOrdemPainelMestre.#focar,
      alvo: AONovaOrdemPainelMestre.#alvo,
      dano: AONovaOrdemPainelMestre.#danoCura,
      cura: AONovaOrdemPainelMestre.#danoCura,
      ocultar: AONovaOrdemPainelMestre.#ocultar,
      combate: AONovaOrdemPainelMestre.#combate
    }
  };

  static PARTS = {
    main: { template: "systems/a-nova-ordem/templates/painel-mestre.hbs", scrollable: [""] }
  };

  static abrir() {
    if (!game.user.isGM) return;
    const app = foundry.applications.instances.get("aon-painel-mestre") ?? new AONovaOrdemPainelMestre();
    app.render({ force: true });
  }

  #linha(token) {
    const a = token.actor;
    const npc = a.type === "npc";
    const max = npc ? Number(a.system.saudeMax ?? 1) : 100;
    const saude = Number(a.system.saude ?? 0);
    return {
      tokenId: token.id,
      nome: token.name,
      img: token.texture.src || a.img,
      npc,
      tier: npc ? a.system.tier : null,
      ameaca: npc ? a.system.ameaca : null,
      saude, max,
      pct: Math.max(0, Math.min(100, Math.round(saude / Math.max(1, max) * 100))),
      estado: npc ? a.system.estadoSaude : status(saude)[0],
      rd: a.system.rd ?? 0,
      oculto: token.hidden,
      alvo: token.object?.isTargeted ?? false,
      emCombate: token.inCombat
    };
  }

  async _prepareContext() {
    const cena = canvas.scene;
    const tokens = (cena?.tokens ?? []).filter(t => t.actor);
    const jogadores = tokens.filter(t => t.actor.type === "personagem" && t.actor.hasPlayerOwner);
    const ameacas = tokens.filter(t => !jogadores.includes(t));

    const ajustes = game.settings.get("a-nova-ordem", "painelMestre") ?? {};
    const exp = EXPERIENCIA[ajustes.experiencia] ? ajustes.experiencia : "novatos";
    const pjs = Number(ajustes.pjs) > 0 ? Number(ajustes.pjs) : jogadores.length;

    // Soma das ameaças hostis/neutras da cena (aliados não contam)
    const hostis = ameacas.filter(t => t.actor.type === "npc" && t.disposition !== CONST.TOKEN_DISPOSITIONS.FRIENDLY);
    const soma = hostis.reduce((t, x) => t + Number(x.actor.system.ameaca ?? 0), 0);
    const orcamento = pjs * EXPERIENCIA[exp].base;
    const razao = orcamento ? soma / orcamento : 0;
    const dificuldade = !soma ? "—"
      : razao <= 0.5 ? "Fácil"
      : razao <= 1 ? "Normal"
      : razao <= 1.5 ? "Difícil"
      : razao <= 2 ? "Mortal"
      : "Além de Mortal";

    return {
      cena: cena?.name ?? "Nenhuma cena",
      jogadores: jogadores.map(t => this.#linha(t)),
      ameacas: ameacas.map(t => this.#linha(t)),
      experiencias: Object.fromEntries(Object.entries(EXPERIENCIA).map(([k, v]) => [k, v.label])),
      exp,
      pjs,
      pjsAuto: !(Number(ajustes.pjs) > 0),
      soma, orcamento, dificuldade,
      faixas: { facil: orcamento * 0.5, normal: orcamento, dificil: orcamento * 1.5, mortal: orcamento * 2 }
    };
  }

  _onRender(context, options) {
    for (const campo of this.element.querySelectorAll("[data-ajuste]")) {
      campo.addEventListener("change", async () => {
        const atual = game.settings.get("a-nova-ordem", "painelMestre") ?? {};
        await game.settings.set("a-nova-ordem", "painelMestre", { ...atual, [campo.dataset.ajuste]: campo.value });
        this.render();
      });
    }
  }

  #token(target) {
    return canvas.scene?.tokens.get(target.closest("[data-token-id]")?.dataset.tokenId);
  }

  static #ficha(event, target) {
    this.#token(target)?.actor?.sheet.render(true);
  }

  static #focar(event, target) {
    const t = this.#token(target)?.object;
    if (!t) return;
    t.control({ releaseOthers: true });
    canvas.animatePan({ x: t.center.x, y: t.center.y });
  }

  static #alvo(event, target) {
    const t = this.#token(target)?.object;
    t?.setTarget(!t.isTargeted, { releaseOthers: false });
    this.render();
  }

  /** Dano (− RD) ou cura com o valor digitado na linha */
  static async #danoCura(event, target) {
    const doc = this.#token(target);
    const valor = Number(target.closest("[data-token-id]").querySelector(".aon-painel-valor")?.value);
    if (!doc?.actor || !(valor > 0)) return ui.notifications.warn("Digite um valor.");
    if (target.dataset.action === "cura") await pedir("cura", { uuid: doc.actor.uuid, cura: valor });
    else await pedir("dano", { uuid: doc.actor.uuid, dano: valor, bruto: true });
  }

  static async #ocultar(event, target) {
    const doc = this.#token(target);
    await doc?.update({ hidden: !doc.hidden });
  }

  /** Coloca todos os tokens da cena no combate (cria o combate se preciso) */
  static async #combate() {
    const tokens = canvas.tokens.placeables.filter(t => t.actor && !t.inCombat);
    if (!tokens.length) return ui.notifications.info("Todos os tokens já estão no combate.");
    const combat = game.combat ?? await Combat.implementation.create({ scene: canvas.scene.id, active: true });
    await TokenDocument.implementation.createCombatants(tokens.map(t => t.document), { combat });
    ui.notifications.info(`${tokens.length} token(s) adicionados ao combate.`);
  }
}

/* Atualiza o painel aberto quando algo muda na cena */
const atualizar = foundry.utils.debounce(() => {
  foundry.applications.instances.get("aon-painel-mestre")?.render();
}, 200);
for (const hook of ["updateActor", "createToken", "deleteToken", "updateToken", "canvasReady", "targetToken", "createCombatant", "deleteCombatant"]) {
  Hooks.on(hook, atualizar);
}

/* Botão nos controles de token (v13: controles e ferramentas são objetos) */
Hooks.on("getSceneControlButtons", controls => {
  if (!game.user.isGM) return;
  const tokens = controls.tokens ?? controls.token;
  if (!tokens?.tools) return;
  tokens.tools.aonPainelMestre = {
    name: "aonPainelMestre",
    title: "Painel do Mestre",
    icon: "fas fa-chess-rook",
    order: Object.keys(tokens.tools).length,
    button: true,
    visible: true,
    onChange: () => AONovaOrdemPainelMestre.abrir()
  };
});
