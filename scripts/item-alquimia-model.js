export class AONovaOrdemAlquimiaModel extends foundry.abstract.DataModel {

  static defineSchema() {
    const f = foundry.data.fields;

    return {

      name: new f.StringField({ initial: "Nenhuma" }),
      
      efeito: new f.StringField({ initial: "" }),
            
      conceito: new f.StringField({ initial: "" }),

      tempo: new f.StringField({ initial: "" }),

      preco: new f.NumberField({ initial: 0 })

    };
  }
}
