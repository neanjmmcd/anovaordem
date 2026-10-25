import { camposModificadores, camposConsumivel } from "./modificadores.js";

export class AONovaOrdemInjecaoModel extends foundry.abstract.DataModel {

  static defineSchema() {
    const f = foundry.data.fields;

    return {
      modificadores: camposModificadores(),
      ...camposConsumivel(),

      name: new f.StringField({ initial: "Nenhuma" }),

      efeito: new f.StringField({ initial: "" }),
      
      colateral: new f.StringField({ initial: "" }),

      conceito: new f.StringField({ initial: "" }),

      preco: new f.NumberField({ initial: 0 })

    };
  }
}
