import { campoQuantidade } from "./modificadores.js";

export class AONovaOrdemArmaModel extends foundry.abstract.DataModel {

  static defineSchema() {
    const f = foundry.data.fields;

    return {
      quantidade: campoQuantidade(),

      name: new f.StringField({ initial: "Nenhuma" }),

      dano: new f.StringField({ initial: "" }),

      // Perícia do teste de ataque ("" = automático, ver combate.js)
      pericia: new f.StringField({ initial: "" }),

      tipo: new f.StringField({ initial: "" }),

      conceito: new f.StringField({ initial: "" }),

      ammo: new f.NumberField({ initial: 1 }),

      vt: new f.NumberField({ initial: 0 }),

      peso: new f.NumberField({ initial: 0 }),

      preco: new f.NumberField({ initial: 0 })

    };
  }
}
