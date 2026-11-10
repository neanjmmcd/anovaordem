/* =========================
 * MODIFICADORES DE ITENS
 * Campos compartilhados pelos itens que alteram a ficha
 * (implantes, mutagênicos, itens, elixires, injeções, drogas)
 * ========================= */

export function camposModificadores() {
  const f = foundry.data.fields;
  const num = () => new f.NumberField({ initial: 0, integer: true });
  return new f.SchemaField({
    // Atributos
    for: num(), des: num(), con: num(), int: num(), sab: num(), psi: num(), car: num(),
    // Recursos
    rd: num(),
    deslocamento: num(),
    carga: num(),
    // Até 3 perícias (chave da perícia em CONFIG.AONOVAORDEM.pericias)
    pericia1: new f.StringField({ initial: "" }), valor1: num(),
    pericia2: new f.StringField({ initial: "" }), valor2: num(),
    pericia3: new f.StringField({ initial: "" }), valor3: num(),
    // Penalidade em um grupo de perícias ("todas" ou chave de CONFIG.AONOVAORDEM.penalidades)
    penGrupo: new f.StringField({ initial: "" }),
    penValor: num(),
    // Ignora todas as penalidades enquanto ativo (ex: Adrena-7)
    anulaPenalidades: new f.BooleanField({ initial: false })
  });
}

/* Quantidade (pilhas de itens, Item Piles); o peso é multiplicado por ela */
export function campoQuantidade() {
  return new foundry.data.fields.NumberField({ initial: 1, integer: true, min: 0 });
}

/* Consumíveis: só valem enquanto ativos, com duração em rodadas de combate */
export function camposConsumivel() {
  const f = foundry.data.fields;
  return {
    ativo: new f.BooleanField({ initial: false }),
    duracao: new f.NumberField({ initial: 0, integer: true, min: 0 }),
    restante: new f.NumberField({ initial: 0, integer: true, min: 0 })
  };
}

/* Tipos de item e se precisam estar ativos para valer */
export const TIPOS_COM_MODIFICADORES = {
  implantes: false,
  mutagenicos: false,
  items: false,
  elixires: true,
  injecoes: true,
  drogas: true
};

/* Categorias de armadura do manual (pela RD Extra) */
const CATEGORIAS_ARMADURA = [
  { rd: 0,  nome: "Nenhuma", pen: 0,  desloc: 0 },
  { rd: 3,  nome: "Leve",    pen: 0,  desloc: 0 },
  { rd: 6,  nome: "Média",   pen: 5,  desloc: 0 },
  { rd: 9,  nome: "Pesada",  pen: 10, desloc: -2 },
  { rd: 12, nome: "Guerra",  pen: 20, desloc: -4 }
];

function categoriaPorRd(rd) {
  let cat = CATEGORIAS_ARMADURA[0];
  for (const c of CATEGORIAS_ARMADURA) if (rd >= c.rd) cat = c;
  return cat;
}

/* Armaduras equipadas (no máximo 2): RD, bônus e penalidades de cada uma se somam. */
export const MAX_ARMADURAS = 2;

export function calcularArmaduras(armaduras) {
  let rd = 0, pen = 0, desloc = 0;
  for (const a of armaduras) {
    const r = Number(a.system.rd ?? 0);
    const cat = categoriaPorRd(r);
    rd += r; pen += cat.pen; desloc += cat.desloc;
  }
  return { rd, pen, desloc };
}
