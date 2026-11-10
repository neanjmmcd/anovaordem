/* =========================
 * LISTA RÁPIDA DE PERÍCIAS
 * Só as perícias que o personagem pode rolar, divididas por grupo.
 * Abre pelo botão no HUD do token ou pelo atalho (P, editável em Controles).
 * ========================= */

import { periciaLiberada } from "./rolls.js";
import { chancePericia, rolarTeste } from "./combate.js";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class AONovaOrdemListaPericias extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    id: "aon-lista-pericias",
    classes: ["a-nova-ordem", "aon-lista-pericias"],
    window: { title: "Perícias", icon: "fas fa-dice-d20", resizable: true },
    position: { width: 340, height: 560 },
    actions: { rolar: AONovaOrdemListaPericias.#rolar }
  };
  static PARTS = { main: { template: "systems/a-nova-ordem/templates/lista-pericias.hbs", scrollable: [""] } };

  constructor(actor, options) {
    super(options);
    this.actor = actor;
  }

  get title() { return `Perícias — ${this.actor.name}`; }

  /** Ator do token selecionado ou o personagem do jogador */
  static abrir(actor) {
    actor ??= canvas.tokens?.controlled[0]?.actor ?? game.user.character;
    if (!actor) return ui.notifications.warn("Selecione um token ou defina o seu personagem.");
    const aberta = foundry.applications.instances.get("aon-lista-pericias");
    if (aberta) { aberta.actor = actor; return aberta.render({ force: true, window: { title: aberta.title } }); }
    return new AONovaOrdemListaPericias(actor).render(true);
  }

  async _prepareContext() {
    const cfg = CONFIG.AONOVAORDEM;
    const grupos = {};
    for (const [key, p] of Object.entries(cfg.pericias)) {
      if (!periciaLiberada(this.actor, key)) continue;
      const chance = chancePericia(this.actor, key).alvo;
      if (this.actor.type === "npc" && chance <= 0) continue;
      (grupos[p.grupo] ??= []).push({ key, label: p.label, chance });
    }
    return {
      grupos: Object.entries(grupos).map(([nome, pericias]) => ({
        nome, st: cfg.gruposSomenteTreinado.includes(nome),
        pericias: pericias.sort((a, b) => a.label.localeCompare(b.label, "pt-BR"))
      }))
    };
  }

  static #rolar(event, alvo) {
    const key = alvo.dataset.pericia;
    if (this.actor.type === "personagem") return window.rolarPericia(this.actor, key);
    return rolarTeste(this.actor, key);
  }
}

/* Botão no HUD do token */
Hooks.on("renderTokenHUD", (hud, html) => {
  const actor = hud.object?.actor;
  if (!actor || !actor.isOwner || !["personagem", "npc"].includes(actor.type)) return;
  const coluna = html.querySelector(".col.right") ?? html.querySelector(".right");
  if (!coluna || coluna.querySelector(".aon-hud-pericias")) return;
  const botao = document.createElement("button");
  botao.type = "button";
  botao.className = "control-icon aon-hud-pericias";
  botao.dataset.tooltip = "Perícias";
  botao.innerHTML = `<i class="fas fa-dice-d20"></i>`;
  botao.addEventListener("click", ev => { ev.preventDefault(); AONovaOrdemListaPericias.abrir(actor); });
  coluna.append(botao);
});

/* Atualiza a lista quando a ficha muda (pontos gastos, penalidades) */
Hooks.on("updateActor", actor => {
  const aberta = foundry.applications.instances.get("aon-lista-pericias");
  if (aberta?.actor === actor) aberta.render();
});

export function registrarListaPericias() {
  game.keybindings.register("a-nova-ordem", "listaPericias", {
    name: "Abrir lista de perícias",
    hint: "Perícias que o token selecionado (ou o seu personagem) pode rolar.",
    editable: [{ key: "KeyP" }],
    onDown: () => { AONovaOrdemListaPericias.abrir(); return true; }
  });
}
