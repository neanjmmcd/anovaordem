import { camposModificadores } from "./modificadores.js";

export class AONovaOrdemMutagenicoModel extends foundry.abstract.DataModel {

  static defineSchema() {
    const f = foundry.data.fields;

    return {
      modificadores: camposModificadores(),

      name: new f.StringField({ initial: "Nenhuma" }),

      efeito: new f.StringField({ initial: "" }),

      mutacao: new f.StringField({ initial: "" }),
      
      conceito: new f.StringField({ initial: "" }),

      preco: new f.NumberField({ initial: 0 })

    };
  }
}
