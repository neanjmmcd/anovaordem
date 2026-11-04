/* =========================
 * NPC / AMEAÇA
 * Ficha compacta seguindo o Suplemento: Tier e função, Saúde em pontos,
 * RD informada, Grupos de Perícias (o valor do grupo vale para toda
 * perícia do grupo) e perícias de destaque com valor próprio.
 * ========================= */

export const AMEACA_POR_TIER = { 0: 1, 1: 2, 2: 4, 3: 8, 4: 16 };
export const TIERS = {
  0: "0 · Presença", 1: "1 · Combatente", 2: "2 · Especialista", 3: "3 · Elite", 4: "4 · Excepcional"
};

const ATRIBUTOS = ["for", "des", "con", "int", "sab", "psi", "car"];

export class AONovaOrdemNpcModel extends foundry.abstract.TypeDataModel {

  static defineSchema() {
    const f = foundry.data.fields;
    const num = (initial = 0) => new f.NumberField({ initial, integer: true });

    return {
      tier: new f.NumberField({ initial: 1, integer: true, min: 0, max: 4 }),
      funcao: new f.StringField({ initial: "" }),
      lema: new f.StringField({ initial: "" }),

      saude: num(40),
      saudeMax: num(40),
      rd: num(5),
      deslocamento: new f.StringField({ initial: "7m" }),
      sanidade: num(100),

      atributos: new f.SchemaField(Object.fromEntries(ATRIBUTOS.map(k => [k, num(8)]))),

      // Valor do grupo, pela chave de penalidade do grupo (penfisica, pensociais…)
      grupos: new f.SchemaField({
        penfisica: num(20), pensociais: num(10), penmentais: num(10), pentecnicologica: num(5),
        penaquimica: num(0), penmagica: num(0), pensobrevivencia: num(15)
      }),

      // Perícias com valor próprio (os "Testes prontos" do suplemento)
      destaques: new f.ArrayField(new f.SchemaField({
        pericia: new f.StringField({ initial: "" }),
        valor: num(0)
      })),

      pontoFraco: new f.StringField({ initial: "" }),
      habilidades: new f.StringField({ initial: "" }),
      equipamento: new f.StringField({ initial: "" }),
      notas: new f.StringField({ initial: "" })
    };
  }

  /** Valor da perícia: destaque, senão o grupo; Resistência Mental nunca abaixo de 20 */
  valorPericia(key) {
    const d = this.destaques.find(x => x.pericia === key);
    let v = d ? Number(d.valor) : Number(this.grupos[CONFIG.AONOVAORDEM.pericias[key]?.penalidade] ?? 0);
    if (key === "resistenciaMental") v = Math.max(20, v);
    return v;
  }

  prepareDerivedData() {
    this.atributosTotais = { ...this.atributos };
    this.ameaca = AMEACA_POR_TIER[this.tier] ?? 1;

    // Estado de Saúde pela porcentagem (a mesma tabela dos personagens, em escala 100)
    const max = Math.max(1, Number(this.saudeMax) || 1);
    const pct = Math.round(Number(this.saude ?? 0) / max * 100);
    const s = Number(this.saude ?? 0);
    const [estado, pen] =
      s <= 0 ? ["Morto", 100]
      : pct > 75 ? ["Operacional", 0]
      : pct > 50 ? ["Ferido", 5]
      : pct > 25 ? ["Gravemente Ferido", 10]
      : pct > 2 ? ["À Beira do Colapso", 15]
      : ["Incapacitado", 20];
    this.saudePct = Math.max(0, Math.min(100, pct));
    this.estadoSaude = estado;
    this.penSaude = pen;
  }
}
