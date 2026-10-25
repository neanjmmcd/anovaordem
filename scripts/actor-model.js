
import { TIPOS_COM_MODIFICADORES, calcularArmaduras } from "./modificadores.js";
import { status, statusSanidade } from "./rolls.js";

const ATRIBUTOS = ["for", "des", "con", "int", "sab", "psi", "car"];
const DESLOCAMENTO_BASE = 7;
// Penalidades dos Estados Mentais (Mente Vazia: não realiza testes Mentais/Sociais)
const PENALIDADE_SANIDADE = {
  "Mente Sã":        { penmentais: 0,   pensociais: 0 },
  "Mente Abalada":   { penmentais: 10,  pensociais: 0 },
  "Mente Fraturada": { penmentais: 20,  pensociais: 10 },
  "Colapso Mental":  { penmentais: 50,  pensociais: 30 },
  "Ruína Mental":    { penmentais: 60,  pensociais: 40 },
  "Mente Vazia":     { penmentais: 100, pensociais: 100 }
};
const DESLOCAMENTO_SAUDE = {
  "Operacional": 0, "Ferido": -1, "Gravemente Ferido": -3, "À Beira do Colapso": -5
};

export class AONovaOrdemPersonagemModel extends foundry.abstract.TypeDataModel {

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

      /* =======================
       * AJUSTES MANUAIS DO MESTRE
       * (somados aos valores calculados)
       * ======================= */
      ajustes: new f.SchemaField({
        rd: new f.NumberField({ initial: 0, integer: true }),
        essencia: new f.NumberField({ initial: 0, integer: true }),
        deslocamento: new f.NumberField({ initial: 0, integer: true })
      }),
    };
  }

  /* =======================
   * VALORES DERIVADOS DOS ITENS
   * Recalculados sempre a partir dos itens na ficha:
   * remover o item normaliza a ficha automaticamente.
   * ======================= */
  prepareDerivedData() {
    const actor = this.parent;
    const items = actor?.items ? [...actor.items] : [];
    const cfg = CONFIG.AONOVAORDEM;
    const ajustes = this.ajustes ?? {};

    const atributosItens = Object.fromEntries(ATRIBUTOS.map(k => [k, 0]));
    const periciasItens = {};
    const penItens = Object.fromEntries(Object.keys(this.penalidades).map(k => [k, 0]));
    let rdItens = 0, deslocItens = 0, cargaExtra = 0;
    let anulaPenalidades = false;
    const fontes = [];

    // Itens com modificadores (implantes, mutagênicos, itens, consumíveis ativos)
    for (const item of items) {
      if (!(item.type in TIPOS_COM_MODIFICADORES)) continue;
      if (TIPOS_COM_MODIFICADORES[item.type] && !item.system.ativo) continue;
      const m = item.system.modificadores;
      if (!m) continue;

      const partes = [];
      for (const k of ATRIBUTOS) {
        if (m[k]) { atributosItens[k] += m[k]; partes.push(`${k.toUpperCase()} ${m[k] > 0 ? "+" : ""}${m[k]}`); }
      }
      if (m.rd) { rdItens += m.rd; partes.push(`RD ${m.rd > 0 ? "+" : ""}${m.rd}`); }
      if (m.deslocamento) { deslocItens += m.deslocamento; partes.push(`Desloc. ${m.deslocamento > 0 ? "+" : ""}${m.deslocamento}m`); }
      if (m.carga) { cargaExtra += m.carga; partes.push(`Carga +${m.carga}un.`); }
      for (const i of [1, 2, 3]) {
        const key = m[`pericia${i}`], val = m[`valor${i}`];
        if (key && val) {
          periciasItens[key] = (periciasItens[key] ?? 0) + val;
          partes.push(`${cfg?.pericias?.[key]?.label ?? key} ${val > 0 ? "+" : ""}${val}%`);
        }
      }
      if (m.penGrupo && m.penValor) {
        const grupos = m.penGrupo === "todas" ? Object.keys(penItens) : [m.penGrupo];
        for (const g of grupos) if (g in penItens) penItens[g] += m.penValor;
        const grupoLabel = m.penGrupo === "todas" ? "todas" : (cfg?.penalidades?.[m.penGrupo]?.label ?? m.penGrupo);
        partes.push(`Penalidade (${grupoLabel}) ${m.penValor > 0 ? "−" : "+"}${Math.abs(m.penValor)}%`);
      }
      if (m.anulaPenalidades) { anulaPenalidades = true; partes.push("Anula penalidades"); }

      if (partes.length) fontes.push({ nome: item.name, texto: partes.join(" · ") });
    }

    // Atributos efetivos
    this.atributosTotais = Object.fromEntries(
      ATRIBUTOS.map(k => [k, Number(this.atributos[k] ?? 0) + atributosItens[k]])
    );

    // Essência: PSI x2, reduzida pelo dreno (%) dos implantes
    const drenoEssencia = items
      .filter(i => i.type === "implantes")
      .reduce((t, i) => t + Number(i.system.essencia ?? 0), 0);
    const humanidade = Math.max(0, 100 - drenoEssencia);
    this.drenoEssencia = drenoEssencia;
    this.humanidade = humanidade;
    this.essenciaMax = Math.max(0,
      Math.floor(this.atributosTotais.psi * 2 * humanidade / 100) + Number(ajustes.essencia ?? 0)
    );

    // Consequências do Dreno de Essência
    this.avisosEssencia = [];
    this.metadeSociais = false;
    if (drenoEssencia > 0) {
      if (humanidade <= 0) this.avisosEssencia.push("0%: sucumbiu à Cyberpsicose.");
      else if (humanidade <= 10) this.avisosEssencia.push("≤10%: perdendo a identidade humana. Risco alto de Cyberpsicose.");
      if (humanidade <= 20) {
        this.atributosTotais.car = Math.floor(this.atributosTotais.car / 2);
        this.metadeSociais = true;
        this.avisosEssencia.push("≤20%: CAR e Perícias Sociais pela metade. Risco médio de Cyberpsicose.");
      }
      if (humanidade <= 30) {
        periciasItens.resistenciaMental = (periciasItens.resistenciaMental ?? 0) - 20;
        this.avisosEssencia.push("≤30%: Resistência Mental −20%. Risco baixo de Cyberpsicose.");
      }
      if (humanidade <= 50) this.avisosEssencia.push("≤50%: feitiços e rituais custam +2 de Essência.");
    }
    this.periciasItens = periciasItens;

    // Armaduras equipadas
    const armadura = calcularArmaduras(
      items.filter(i => i.type === "armadura" && i.system.equipado !== false)
    );

    // RD = CON + armaduras equipadas + implantes + ajuste
    this.rd = this.atributosTotais.con + armadura.rd + rdItens + Number(ajustes.rd ?? 0);
    this.rdDetalhe = `CON ${this.atributosTotais.con} + Armadura ${armadura.rd}`
      + (rdItens ? ` + Itens ${rdItens}` : "")
      + (ajustes.rd ? ` + Ajuste ${ajustes.rd}` : "");

    // Peso total carregado
    this.pesoUnit = items.reduce((t, i) => t + Number(i.system.peso ?? 0), 0);
    this.cargaExtra = cargaExtra;

    // Penalidades totais = Saúde (gravadas) + armadura (físicas) + Sanidade + itens
    penItens.penfisica += armadura.pen;
    const [estadoMental] = statusSanidade(Number(this.sanidade ?? 0));
    const penSanidade = PENALIDADE_SANIDADE[estadoMental] ?? {};
    for (const [g, v] of Object.entries(penSanidade)) penItens[g] += v;
    this.estadoMental = estadoMental;
    if (penSanidade.penmentais) {
      fontes.push({
        nome: `Sanidade (${estadoMental})`,
        texto: `Mentais −${penSanidade.penmentais}%` + (penSanidade.pensociais ? ` · Sociais −${penSanidade.pensociais}%` : "")
      });
    }
    this.penalidadesTotais = Object.fromEntries(
      Object.keys(this.penalidades).map(k => [
        k, anulaPenalidades ? 0 : Math.max(0, Number(this.penalidades[k] ?? 0) + penItens[k])
      ])
    );
    this.anulaPenalidades = anulaPenalidades;
    if (armadura.pen) fontes.push({ nome: "Armadura", texto: `Físicas −${armadura.pen}%` + (armadura.desloc ? ` · Desloc. ${armadura.desloc}m` : "") });

    // Deslocamento
    const [estado] = status(Number(this.saude ?? 0));
    const deslocSaude = DESLOCAMENTO_SAUDE[estado];
    this.deslocamento = deslocSaude === undefined ? 0 : Math.max(0,
      DESLOCAMENTO_BASE + deslocSaude + armadura.desloc + deslocItens + Number(ajustes.deslocamento ?? 0)
    );

    this.fontesModificadores = fontes;
  }
}
