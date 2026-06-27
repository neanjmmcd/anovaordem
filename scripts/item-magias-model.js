export class AONovaOrdemMagiasModel extends foundry.abstract.DataModel {

  static defineSchema() {
    const f = foundry.data.fields;

    return {

      name: new f.StringField({ initial: "Nenhuma" }),

      conceito: new f.StringField({ initial: "" }),

      essencia: new f.NumberField({ initial: 0 }),

      dano: new f.NumberField({ initial: 0 }),

      efeito: new f.StringField({ initial: "" }),

      circulo: new f.NumberField({ initial: 0 })

    };
  }
}
