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

/*
 * Armaduras equipadas:
 * - RD soma.
 * - Mesma categoria: penalidade proporcional (2 Leves = RD 6 = penalidade de Média).
 * - Categorias diferentes: penalidades acumuladas e dobradas.
 */
export function calcularArmaduras(armaduras) {
  const rd = armaduras.reduce((t, a) => t + Number(a.system.rd ?? 0), 0);
  const porCategoria = {};
  for (const a of armaduras) {
    const r = Number(a.system.rd ?? 0);
    if (r <= 0) continue;
    const cat = categoriaPorRd(r);
    porCategoria[cat.nome] = (porCategoria[cat.nome] ?? 0) + r;
  }
  const grupos = Object.values(porCategoria).map(categoriaPorRd);
  let pen = grupos.reduce((t, c) => t + c.pen, 0);
  let desloc = grupos.reduce((t, c) => t + c.desloc, 0);
  if (grupos.length > 1) { pen *= 2; desloc *= 2; }
  return { rd, pen, desloc };
}
