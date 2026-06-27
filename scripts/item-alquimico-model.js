export class AONovaOrdemAlquimicoModel extends foundry.abstract.DataModel {

  static defineSchema() {
    const f = foundry.data.fields;

    return {

      pedra: new f.StringField({ initial: "Nenhuma" }),
      
      nivel: new f.NumberField({ initial: 0 }),
      
      tipo: new f.StringField({ initial: "" }),
      
      tecnica: new f.StringField({ initial: "" }),

      alvo: new f.StringField({ initial: "" }),

      efeito: new f.StringField({ initial: "" }),
      
      dano: new f.StringField({ initial: "" })

    };
  }
}
