import { camposModificadores } from "./modificadores.js";

export class AONovaOrdemItemsModel extends foundry.abstract.DataModel {

  static defineSchema() {
    const f = foundry.data.fields;

    return {
      modificadores: camposModificadores(),

      tipo: new f.StringField({ initial: "Nenhuma" }),

      uso: new f.StringField({ initial: "" }),

      efeito: new f.StringField({ initial: "" }),

      conceito: new f.StringField({ initial: "" }),

      peso: new f.NumberField({ initial: 0 }),

      preco: new f.NumberField({ initial: 0 })

    };
  }
}
