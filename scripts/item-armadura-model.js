import { campoQuantidade } from "./modificadores.js";

export class AONovaOrdemArmaduraModel extends foundry.abstract.DataModel {

  static defineSchema() {
    const f = foundry.data.fields;

    return {
      quantidade: campoQuantidade(),
      equipado: new f.BooleanField({ initial: true }),

      // Tratada contra um tipo de dano alquímico: protege por inteiro contra ele
      tratamento: new f.SchemaField(Object.fromEntries(
        ["calor", "frio", "eletrico", "cinetico", "quimico"].map(k => [k, new f.BooleanField({ initial: false })])
      )),

      tipo: new f.StringField({ initial: "Nenhuma" }),

      rd: new f.NumberField({ initial: 0 }),

      penalidades: new f.StringField({ initial: "nenhuma" }),

      conceito: new f.StringField({ initial: "" }),

      peso: new f.NumberField({ initial: 0 }),

      preco: new f.NumberField({ initial: 0 })

    };
  }
}
