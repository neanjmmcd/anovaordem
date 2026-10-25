import { camposModificadores } from "./modificadores.js";

export class AONovaOrdemImplantesModel extends foundry.abstract.DataModel {

  static defineSchema() {
    const f = foundry.data.fields;

    return {
      modificadores: camposModificadores(),

      name: new f.StringField({ initial: "Nenhuma" }),

      efeito: new f.StringField({ initial: "" }),

      essencia: new f.NumberField({ initial: 0 }),

      conceito: new f.StringField({ initial: "" }),

      preco: new f.NumberField({ initial: 0 })

    };
  }
}
