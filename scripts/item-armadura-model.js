export class AONovaOrdemArmaduraModel extends foundry.abstract.DataModel {

  static defineSchema() {
    const f = foundry.data.fields;

    return {

      tipo: new f.StringField({ initial: "Nenhuma" }),

      rd: new f.NumberField({ initial: 0 }),

      penalidades: new f.StringField({ initial: "nenhuma" }),

      conceito: new f.StringField({ initial: "" }),

      peso: new f.NumberField({ initial: 0 }),

      preco: new f.NumberField({ initial: 0 })

    };
  }
}
