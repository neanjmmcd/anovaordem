export class AONovaOrdemVenenoModel extends foundry.abstract.DataModel {

  static defineSchema() {
    const f = foundry.data.fields;

    return {

      name: new f.StringField({ initial: "Nenhuma" }),

      tipo: new f.StringField({ initial: "" }),

      efeito: new f.StringField({ initial: "" }),

      conceito: new f.StringField({ initial: "" }),

      preco: new f.NumberField({ initial: 0 })

    };
  }
}
