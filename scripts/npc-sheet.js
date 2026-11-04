import { TIERS } from "./npc-model.js";
import { atacar, chancePericia, periciaDaArma, rolarTeste } from "./combate.js";

/* Ficha compacta de NPC (Tiers do Suplemento) */
export class AONovaOrdemNpcSheet extends foundry.appv1.sheets.ActorSheet {

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["a-nova-ordem", "sheet", "actor", "npc"],
      template: "systems/a-nova-ordem/sheets/npc-sheet.html",
      width: 620,
      height: 720
    });
  }

  getData() {
    const context = super.getData();
    const s = this.actor.system;
    const cfg = CONFIG.AONOVAORDEM;
    context.system = s;
    context.tiers = TIERS;
    context.periciaOptions = cfg.periciaOptions;

    context.atributos = Object.entries(s.atributos).map(([key, valor]) => ({
      key, valor, label: key.toUpperCase()
    }));
    context.grupos = Object.entries(s.grupos).map(([key, valor]) => ({
      key, valor, label: cfg.penalidades[key]?.label ?? key
    }));
    context.destaques = s.destaques.map((d, i) => ({
      i, ...d,
      chance: d.pericia ? chancePericia(this.actor, d.pericia).alvo : null
    }));
    context.armas = this.actor.items.filter(i => i.type === "arma").map(i => {
      const pericia = periciaDaArma(i);
      return {
        id: i.id, nome: i.name, img: i.img, dano: i.system.dano, ammo: i.system.ammo,
        pericia: cfg.pericias[pericia]?.label ?? pericia,
        chance: chancePericia(this.actor, pericia).alvo
      };
    });
    context.outros = this.actor.items.filter(i => i.type !== "arma").map(i => ({
      id: i.id, nome: i.name, img: i.img, tipo: cfg.tiposItem[i.type] ?? i.type
    }));
    return context;
  }

  activateListeners(html) {
    super.activateListeners(html);
    if (!this.isEditable) return;

    html.find(".rolar-atributo").on("click", ev => window.rolarAtributo(this.actor, ev.currentTarget.dataset.atributo));
    html.find(".npc-rolar-pericia").on("click", ev => rolarTeste(this.actor, ev.currentTarget.dataset.pericia));
    html.find(".npc-rolar-qualquer").on("click", () => {
      const key = html.find(".npc-qualquer-pericia").val();
      if (key) rolarTeste(this.actor, key);
    });

    html.find(".npc-add-destaque").on("click", () => {
      const lista = this.actor.system.toObject().destaques;
      lista.push({ pericia: "", valor: 30 });
      this.actor.update({ "system.destaques": lista });
    });
    html.find(".npc-del-destaque").on("click", ev => {
      const lista = this.actor.system.toObject().destaques;
      lista.splice(Number(ev.currentTarget.dataset.index), 1);
      this.actor.update({ "system.destaques": lista });
    });
    html.find(".npc-destaque-campo").on("change", ev => {
      ev.stopPropagation();
      const el = ev.currentTarget;
      const lista = this.actor.system.toObject().destaques;
      const valor = el.dataset.campo === "valor" ? Number(el.value) || 0 : el.value;
      lista[Number(el.dataset.index)][el.dataset.campo] = valor;
      this.actor.update({ "system.destaques": lista });
    });

    html.find(".npc-atacar").on("click", async ev => {
      const item = this.actor.items.get(ev.currentTarget.dataset.itemId);
      if (!item) return;
      await atacar(this.actor, item);
      window.tocarAnimacao(this.actor, item);
    });
    html.find(".npc-abrir-item").on("click", ev => this.actor.items.get(ev.currentTarget.dataset.itemId)?.sheet.render(true));
    html.find(".npc-del-item").on("click", ev => this.actor.items.get(ev.currentTarget.dataset.itemId)?.delete());
  }
}
