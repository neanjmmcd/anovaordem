export class AONovaOrdemRituaisModel extends foundry.abstract.DataModel {

  static defineSchema() {
    const f = foundry.data.fields;

    return {

      name: new f.StringField({ initial: "Nenhuma" }),

      conceito: new f.StringField({ initial: "" }),

      essencia: new f.StringField({ initial: "" }),

      tempo: new f.StringField({ initial: "" }),

      efeito: new f.StringField({ initial: "" })

    };
  }
}
