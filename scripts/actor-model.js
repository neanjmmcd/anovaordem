
export class AONovaOrdemPersonagemModel extends foundry.abstract.DataModel {

  static defineSchema() {
    const f = foundry.data.fields;

    return {
   
      /* =======================
       * DADOS BÁSICOS
       * ======================= */

      codinome: new f.StringField({ initial: "" }),
      idade: new f.StringField({ initial: "" }),
      pele: new f.StringField({ initial: "" }),
      olhos: new f.StringField({ initial: "" }),
      peso: new f.StringField({ initial: "" }),

      rd: new f.NumberField({ initial: 0 }),
      saude: new f.NumberField({ initial: 100 }),
      sanidade: new f.NumberField({ initial: 100 }),
      essencia: new f.NumberField({ initial: 0 }),
      pesoUnit: new f.NumberField({ initial: 0 }),
      creditoRd: new f.NumberField({ initial: 0 }),

      /* =======================
       * ATRIBUTOS
       * ======================= */

      atributos: new f.SchemaField({
        for: new f.NumberField({ initial: 0 }),
        des: new f.NumberField({ initial: 0 }),
        con: new f.NumberField({ initial: 0 }),
        int: new f.NumberField({ initial: 0 }),
        sab: new f.NumberField({ initial: 0 }),
        psi: new f.NumberField({ initial: 0 }),
        car: new f.NumberField({ initial: 0 })
      }),
      /* =======================
       * PENALIDADE
       * ======================= */

      penalidades: new f.SchemaField({
        penfisica: new f.NumberField({ initial: 0 }),
        pensociais: new f.NumberField({ initial: 0 }),
        penmentais: new f.NumberField({ initial: 0 }),
        pentecnicologica: new f.NumberField({ initial: 0 }),
        penaquimica: new f.NumberField({ initial: 0 }),
        penmagica: new f.NumberField({ initial: 0 }),
        pensobrevivencia: new f.NumberField({ initial: 0 })
      }),

      /* =======================
       * PERÍCIAS
       * ======================= */

      pericias: new f.SchemaField({

        /* FÍSICAS */
        atletismo: new f.SchemaField({ valor: new f.NumberField({ initial: 15 }), bonus: new f.NumberField({ initial: 0 }) }),
        briga: new f.SchemaField({ valor: new f.NumberField({ initial: 10 }), bonus: new f.NumberField({ initial: 0 }) }),
        armasBrancas: new f.SchemaField({ valor: new f.NumberField({ initial: 5 }), bonus: new f.NumberField({ initial: 0 }) }),
        armasFogo: new f.SchemaField({ valor: new f.NumberField({ initial: 5 }), bonus: new f.NumberField({ initial: 0 }) }),
        armasPesadas: new f.SchemaField({ valor: new f.NumberField({ initial: 0 }), bonus: new f.NumberField({ initial: 0 }) }),
        esquiva: new f.SchemaField({ valor: new f.NumberField({ initial: 15 }), bonus: new f.NumberField({ initial: 0 }) }),
        furtividade: new f.SchemaField({ valor: new f.NumberField({ initial: 10 }), bonus: new f.NumberField({ initial: 0 }) }),
        direcao: new f.SchemaField({ valor: new f.NumberField({ initial: 10 }), bonus: new f.NumberField({ initial: 0 }) }),
        pilotagem: new f.SchemaField({ valor: new f.NumberField({ initial: 0 }), bonus: new f.NumberField({ initial: 0 }) }),
        arrombamento: new f.SchemaField({ valor: new f.NumberField({ initial: 5 }), bonus: new f.NumberField({ initial: 0 }) }),
        prestidigitacao: new f.SchemaField({ valor: new f.NumberField({ initial: 5 }), bonus: new f.NumberField({ initial: 0 }) }),
        resistenciaFisica: new f.SchemaField({ valor: new f.NumberField({ initial: 15 }), bonus: new f.NumberField({ initial: 0 }) }),

        /* SOCIAIS */
        persuasao: new f.SchemaField({ valor: new f.NumberField({ initial: 15 }), bonus: new f.NumberField({ initial: 0 }) }),
        intimidacao: new f.SchemaField({ valor: new f.NumberField({ initial: 10 }), bonus: new f.NumberField({ initial: 0 }) }),
        enganacao: new f.SchemaField({ valor: new f.NumberField({ initial: 10 }), bonus: new f.NumberField({ initial: 0 }) }),
        leituraSocial: new f.SchemaField({ valor: new f.NumberField({ initial: 15 }), bonus: new f.NumberField({ initial: 0 }) }),
        etiqueta: new f.SchemaField({ valor: new f.NumberField({ initial: 5 }), bonus: new f.NumberField({ initial: 0 }) }),
        manha: new f.SchemaField({ valor: new f.NumberField({ initial: 10 }), bonus: new f.NumberField({ initial: 0 }) }),
        performance: new f.SchemaField({ valor: new f.NumberField({ initial: 5 }), bonus: new f.NumberField({ initial: 0 }) }),

        /* MENTAIS */
        analise: new f.SchemaField({ valor: new f.NumberField({ initial: 10 }), bonus: new f.NumberField({ initial: 0 }) }),
        financas: new f.SchemaField({ valor: new f.NumberField({ initial: 5 }), bonus: new f.NumberField({ initial: 0 }) }),
        linguistica: new f.SchemaField({ valor: new f.NumberField({ initial: 1 }), bonus: new f.NumberField({ initial: 0 }) }),
        ocultismo: new f.SchemaField({ valor: new f.NumberField({ initial: 0 }), bonus: new f.NumberField({ initial: 0 }) }),
        academicos: new f.SchemaField({ valor: new f.NumberField({ initial: 1 }), bonus: new f.NumberField({ initial: 0 }) }),

        /* TECNOLÓGICAS */
        engenharia: new f.SchemaField({ valor: new f.NumberField({ initial: 5 }), bonus: new f.NumberField({ initial: 0 }) }),
        cibernetica: new f.SchemaField({ valor: new f.NumberField({ initial: 0 }), bonus: new f.NumberField({ initial: 0 }) }),
        demolicoes: new f.SchemaField({ valor: new f.NumberField({ initial: 0 }), bonus: new f.NumberField({ initial: 0 }) }),
        eletronica: new f.SchemaField({ valor: new f.NumberField({ initial: 5 }), bonus: new f.NumberField({ initial: 0 }) }),
        armasExperimentais: new f.SchemaField({ valor: new f.NumberField({ initial: 0 }), bonus: new f.NumberField({ initial: 0 }) }),

        /* ALQUIMIA */
        alquimia: new f.SchemaField({ valor: new f.NumberField({ initial: 0 }), bonus: new f.NumberField({ initial: 0 }) }),
        pedrasEnergia: new f.SchemaField({ valor: new f.NumberField({ initial: 0 }), bonus: new f.NumberField({ initial: 0 }) }),
        mutagenese: new f.SchemaField({ valor: new f.NumberField({ initial: 0 }), bonus: new f.NumberField({ initial: 0 }) }),

        /* MÁGICAS */
        feiticaria: new f.SchemaField({ valor: new f.NumberField({ initial: 0 }), bonus: new f.NumberField({ initial: 0 }) }),
        rituais: new f.SchemaField({ valor: new f.NumberField({ initial: 0 }), bonus: new f.NumberField({ initial: 0 }) }),
        resistenciaMental: new f.SchemaField({ valor: new f.NumberField({ initial: 20 }), bonus: new f.NumberField({ initial: 0 }) }),

        /* SOBREVIVÊNCIA */
        percepcao: new f.SchemaField({ valor: new f.NumberField({ initial: 20 }), bonus: new f.NumberField({ initial: 0 }) }),
        sobrevivencia: new f.SchemaField({ valor: new f.NumberField({ initial: 10 }), bonus: new f.NumberField({ initial: 0 }) }),
        rastreamento: new f.SchemaField({ valor: new f.NumberField({ initial: 5 }), bonus: new f.NumberField({ initial: 0 }) }),
        medicina: new f.SchemaField({ valor: new f.NumberField({ initial: 5 }), bonus: new f.NumberField({ initial: 0 }) }),
        tratoAnimais: new f.SchemaField({ valor: new f.NumberField({ initial: 5 }), bonus: new f.NumberField({ initial: 0 })  })
      }),

      /* =======================
       * ANOTAÇÕES / ITENS
       * ======================= */

      anotacoes: new f.StringField({ initial: "" }),
    };
  }
}
