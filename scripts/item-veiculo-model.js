export class AONovaOrdemVeiculoModel extends foundry.abstract.DataModel {

  static defineSchema() {
    const f = foundry.data.fields;

    return {

      name: new f.StringField({ initial: "Nenhuma" }),

      ex: new f.StringField({ initial: "" }),

      vel: new f.NumberField({ initial: 0 }),

      est: new f.NumberField({ initial: 0 }),

      bld: new f.NumberField({ initial: 0 }),

      pot: new f.NumberField({ initial: 0 }),

      preco: new f.NumberField({ initial: 0 })

    };
  }
}
