export class AONovaOrdemDrogasModel extends foundry.abstract.DataModel {

  static defineSchema() {
    const f = foundry.data.fields;

    return {

      name: new f.StringField({ initial: "Nenhuma" }),

      tipo: new f.StringField({ initial: "" }),

      efeito: new f.StringField({ initial: "" }),

      colateral: new f.StringField({ initial: "" })

    };
  }
}
