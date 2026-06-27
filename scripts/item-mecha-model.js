export class AONovaOrdemMechaModel extends foundry.abstract.DataModel {

  static defineSchema() {
    const f = foundry.data.fields;

    return {

      name: new f.StringField({ initial: "Nenhuma" }),

      tipo: new f.StringField({ initial: "" }),

      vel: new f.NumberField({ initial: 0 }),

      est: new f.NumberField({ initial: 0 }),

      bld: new f.NumberField({ initial: 0 }),

      mob: new f.NumberField({ initial: 0 }),

      pre: new f.NumberField({ initial: 0 }),

      pot: new f.NumberField({ initial: 0 }),

      preco: new f.NumberField({ initial: 0 })

    };
  }
}
