export const AONOVAORDEM = {};

// AONOVAORDEM.atributos = {
//   for: { label: "FOR" },
//   des: { label: "DES" },
//   con: { label: "CON" },
//   int: { label: "INT" },
//   sab: { label: "SAB" },
//   psi: { label: "PSI" },
//   car: { label: "CAR" }
// };

AONOVAORDEM.atributos = {
  for: { label: "FORÇA" },
  des: { label: "DESTREZA" },
  con: { label: "CONSTITUIÇÃO" },
  int: { label: "INTELIGÊNCIA" },
  sab: { label: "SABEDORIA" },
  psi: { label: "PSI" },
  car: { label: "CARISMA" }
};
AONOVAORDEM.penalidades = {
  penfisica: {label:"Físicas"},
  pensociais: {label:"Sociais"},
  penmentais: {label:"Mentais"},
  pentecnicologica: {label:"Tecnológicas"},
  penaquimica: {label:"Alquímicas"},
  penmagica: {label:"Mágicas"},
  pensobrevivencia: {label:"Sobrevivência"}
};
AONOVAORDEM.pericias = {

  /* FÍSICAS */
  atletismo: {
    label: "Atletismo",
    grupo: "FÍSICAS",
    atributos: ["for", "des"],
    penalidade: "penfisica"
  },
  briga: {
    label: "Briga",
    grupo: "FÍSICAS",
    atributos: ["for"],
    penalidade: "penfisica"
  },
  armasBrancas: {
    label: "Armas Brancas",
    grupo: "FÍSICAS",
    atributos: ["for", "des"],
    penalidade: "penfisica"
  },
  armasFogo: {
    label: "Armas de Fogo",
    grupo: "FÍSICAS",
    atributos: ["des"],
    penalidade: "penfisica"
  },
  armasPesadas: {
    label: "Armas Pesadas",
    grupo: "FÍSICAS",
    atributos: ["des"],
    penalidade: "penfisica"
  },
  esquiva: {
    label: "Esquiva",
    grupo: "FÍSICAS",
    atributos: ["des"],
    penalidade: "penfisica"
  },
  furtividade: {
    label: "Furtividade",
    grupo: "FÍSICAS",
    atributos: ["des"],
    penalidade: "penfisica"
  },
  direcao: {
    label: "Direção",
    grupo: "FÍSICAS",
    atributos: ["des"],
    penalidade: "penfisica"
  },
  pilotagem: {
    label: "Pilotagem",
    grupo: "FÍSICAS",
    atributos: ["des"],
    penalidade: "penfisica"
  },
  arrombamento: {
    label: "Arrombamento",
    grupo: "FÍSICAS",
    atributos: ["des"],
    penalidade: "penfisica"
  },
  prestidigitacao: {
    label: "Prestidigitação",
    grupo: "FÍSICAS",
    atributos: ["des"],
    penalidade: "penfisica"
  },
  resistenciaFisica: {
    label: "Resistência Física",
    grupo: "FÍSICAS",
    atributos: ["con"],
    penalidade: "penfisica"
  },

  /* SOCIAIS */
  persuasao: {
    label: "Persuasão",
    grupo: "SOCIAIS",
    atributos: ["car"],
    penalidade: "pensociais"
  },
  intimidacao: {
    label: "Intimidação",
    grupo: "SOCIAIS",
    atributos: ["car", "for"],
    penalidade: "pensociais"
  },
  enganacao: {
    label: "Enganação",
    grupo: "SOCIAIS",
    atributos: ["car"],
    penalidade: "pensociais"
  },
  leituraSocial: {
    label: "Leitura Social",
    grupo: "SOCIAIS",
    atributos: ["sab"],
    penalidade: "pensociais"
  },
  etiqueta: {
    label: "Etiqueta",
    grupo: "SOCIAIS",
    atributos: ["int"],
    penalidade: "pensociais"
  },
  manha: {
    label: "Manha",
    grupo: "SOCIAIS",
    atributos: ["int"],
    penalidade: "pensociais"
  },
  performance: {
    label: "Performance",
    grupo: "SOCIAIS",
    atributos: ["car"],
    penalidade: "pensociais"
  },

  /* MENTAIS */
  analise: {
    label: "Análise",
    grupo: "MENTAIS",
    atributos: ["int"],
    penalidade: "penmentais"
  },
  financas: {
    label: "Finanças",
    grupo: "MENTAIS",
    atributos: ["int"],
    penalidade: "penmentais"
  },
  linguistica: {
    label: "Linguística",
    grupo: "MENTAIS",
    atributos: ["int"],
    penalidade: "penmentais"
  },
  ocultismo: {
    label: "Ocultismo",
    grupo: "MENTAIS",
    atributos: ["int"],
    penalidade: "penmentais"
  },
  academicos: {
    label: "Acadêmicos",
    grupo: "MENTAIS",
    atributos: ["int"],
    penalidade: "penmentais"
  },

  /* TECNOLÓGICAS */
  engenharia: {
    label: "Engenharia",
    grupo: "TECNOLÓGICAS",
    atributos: ["int"],
    penalidade: "pentecnicologica"
  },
  cibernetica: {
    label: "Cibernética",
    grupo: "TECNOLÓGICAS",
    atributos: ["int"],
    penalidade: "pentecnicologica"
  },
  demolicoes: {
    label: "Demolições",
    grupo: "TECNOLÓGICAS",
    atributos: ["int"],
    penalidade: "pentecnicologica"
  },
  eletronica: {
    label: "Eletrônica",
    grupo: "TECNOLÓGICAS",
    atributos: ["int"],
    penalidade: "pentecnicologica"
  },
  armasExperimentais: {
    label: "Armas Experimentais",
    grupo: "TECNOLÓGICAS",
    atributos: ["int", "des"],
    penalidade: "pentecnicologica"
  },

  /* ALQUIMIA */
  alquimia: {
    label: "Alquimia",
    grupo: "ALQUIMIA",
    atributos: ["int"],
    penalidade: "penaquimica"
  },
  pedrasEnergia: {
    label: "Pedras de Energia",
    grupo: "ALQUIMIA",
    atributos: ["int"],
    penalidade: "penaquimica"
  },
  mutagenese: {
    label: "Mutagênese",
    grupo: "ALQUIMIA",
    atributos: ["int"],
    penalidade: "penaquimica"
  },

  /* MÁGICAS */
  feiticaria: {
    label: "Feitiçaria",
    grupo: "MÁGICAS",
    atributos: ["psi"],
    penalidade: "penmagica"
  },
  rituais: {
    label: "Rituais",
    grupo: "MÁGICAS",
    atributos: ["psi"],
    penalidade: "penmagica"
  },
  resistenciaMental: {
    label: "Resistência Mental",
    grupo: "MÁGICAS",
    atributos: ["psi"],
    penalidade: "penmagica"
  },

  /* SOBREVIVÊNCIA */
  percepcao: {
    label: "Percepção",
    grupo: "SOBREVIVÊNCIA",
    atributos: ["sab"],
    penalidade: "pensobrevivencia"
  },
  sobrevivencia: {
    label: "Sobrevivência",
    grupo: "SOBREVIVÊNCIA",
    atributos: ["sab", "des"],
    penalidade: "pensobrevivencia"
  },
  rastreamento: {
    label: "Rastreamento",
    grupo: "SOBREVIVÊNCIA",
    atributos: ["sab"],
    penalidade: "pensobrevivencia"
  },
  medicina: {
    label: "Medicina",
    grupo: "SOBREVIVÊNCIA",
    atributos: ["int"],
    penalidade: "pensobrevivencia"
  },
  tratoAnimais: {
    label: "Trato com Animais",
    grupo: "SOBREVIVÊNCIA",
    atributos: ["des", "sab"],
    penalidade: "pensobrevivencia"
  },
  
};


/* Opções dos seletores de modificadores nas fichas de item */
AONOVAORDEM.periciaOptions = Object.fromEntries(
  Object.entries(AONOVAORDEM.pericias)
    .map(([key, p]) => [key, p.label])
    .sort((a, b) => a[1].localeCompare(b[1], "pt-BR"))
);
AONOVAORDEM.penGrupoOptions = {
  todas: "Todas",
  ...Object.fromEntries(Object.entries(AONOVAORDEM.penalidades).map(([key, p]) => [key, p.label]))
};
