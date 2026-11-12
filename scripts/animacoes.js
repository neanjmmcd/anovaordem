/* =========================
 * ANIMAÇÕES DO SISTEMA (Automated Animations)
 * Efeitos e sons próprios (gerados no NeanTools) em assets/animacoes e
 * assets/sons. O botão em Configurações → "Animações" grava no menu de
 * Reconhecimento Automático do Automated Animations uma entrada por nome
 * de item do compêndio. Não precisa do JB2A: todas usam caminho próprio.
 * O AA reconhece o item quando o nome dele CONTÉM o rótulo (sem espaços,
 * sem diferenciar maiúsculas), e o rótulo mais longo vence.
 * ========================= */

const SISTEMA = "a-nova-ordem";
const VIDEO = nome => `systems/${SISTEMA}/assets/animacoes/${nome}.webm`;
const SOM = nome => `systems/${SISTEMA}/assets/sons/${nome}.ogg`;
const VERSAO_MENU = 5; // formato do menu no Automated Animations 6.x
const VERSAO_ANIMACOES = "3"; // aumente ao mudar a tabela: o mestre recebe a atualização sozinho

/* rótulos → efeito. menu "range" = projétil até o alvo; "ontoken" = efeito no alvo
 * (consumíveis tocam no próprio personagem, ver tocarAnimacao em rolls.js) */
const GRUPOS = [
  // Armas de fogo
  // Armas de fogo: traçante fino desenhado por código (a rajada já vem no próprio vídeo)
  { menu: "range", video: "tiro_pistola", som: "tiro", rotulos: ["Pistola", "Revólver", "Luger"] },
  { menu: "range", video: "tiro_rifle", som: "tiro", rotulos: ["Rifle"] },
  { menu: "range", video: "espingarda", som: "tiro", rotulos: ["Espingarda"] },
  { menu: "range", video: "rajada", som: "rajada", rotulos: ["Submetralhadora", "Fuzil"] },
  { menu: "range", video: "rajada_pesada", som: "rajada", rotulos: ["Metralhadora", "Heavy Machine Gun", "Gatling"] },
  // Projétil grande até o alvo, com explosão no impacto
  { menu: "range", video: "disparo_pesado", som: "explosao", secundario: "explosao", rotulos: ["Lança-Granadas", "Canhão"] },
  // Elétrico
  { menu: "range", video: "raio", som: "raio", rotulos: ["Taser", "Voltaic", "Tesla", "Indra", "Raijin"] },
  // Jato contínuo até o alvo (feixe)
  { menu: "range", video: "chamas", som: "chamas", rotulos: ["Lança-chamas"] },
  // Projéteis alquímicos
  { menu: "range", video: "bola_fogo", som: "chamas", rotulos: ["Cinderita", "Braserita", "Surtr", "Agni"] },
  { menu: "range", video: "gelo", som: "gelo", rotulos: ["Glacium", "Boreal", "Skadi", "Niflheim"] },
  { menu: "range", video: "acido", som: "acido", rotulos: ["Corros", "Apep", "Nergal", "Descarga Cáustica"] },
  // No alvo
  { menu: "ontoken", video: "gas", som: "gas", size: 2, rotulos: ["Gás Lacrimogêneo", "Gás Mostarda", "Miasma", "Spray de Pimenta"] },
  { menu: "ontoken", video: "explosao", som: "explosao", size: 2, rotulos: ["Granada Concussiva", "Hyperion"] },
  { menu: "ontoken", video: "onda", som: "explosao", size: 2, rotulos: ["Impacta", "Tremor", "Atlas"] },
  { menu: "ontoken", video: "clarao", som: "clarao", size: 2, rotulos: ["Granada de Luz"] },
  { menu: "ontoken", video: "corte", som: "corte",
    rotulos: ["Lâmina", "Machado", "Lança Curta", "Picador de Gelo", "Katana", "Gládio", "Adaga", "Ferrão", "Patas Cortantes", "Açoite"] },
  { menu: "ontoken", video: "impacto", som: "impacto",
    rotulos: ["Soco", "Chute", "Encontrão", "Bastão", "Marreta", "Martelo", "Soqueira", "Golpes", "Mordida", "Mandíbula",
              "Fauce", "Esmagamento", "Aríete", "Arremesso", "Escudo"] },
  { menu: "ontoken", video: "impacto", som: "raio", rotulos: ["Bastão Elétrico"] },
  // Feitiços (no alvo) e rituais (em quem conjura); nome exato: "Visão" não pode pegar "Visão Térmica"
  { menu: "ontoken", video: "magia", som: "magia", size: 2, exato: true,
    rotulos: ["Ebulição", "Sussurros na Escuridão", "Compreensão", "Crise Existencial", "Ecos do Exterior", "Olhar Desalinhado",
              "Visão", "Instinto de Presa", "Obediência", "Fúria Cega", "Quebra", "Pânico",
              "Marca do Servo Silente", "Liturgia do Corpo Vazio", "Totem do Mau Olhado Permanente", "Véu da Noite"] },
  // Consumíveis no próprio personagem
  { menu: "ontoken", video: "cura", som: "cura", rotulos: ["Soro do Cão", "Destilado Âmbar", "Elixir"] },
  { menu: "ontoken", video: "estimulante", som: "injecao", rotulos: ["Pulso Carmesim", "Adrena-7", "Noosfina", "Éter Sereno", "Córtex-Flux"] }
];

export const ROTULOS = GRUPOS.flatMap(g => g.rotulos);

function somVazio() {
  return { delay: 0, enable: false, file: "", startTime: 0, volume: 1, repeat: 1, repeatDelay: 250 };
}

function videoPadrao(dbSection) {
  return dbSection === "range"
    ? { dbSection, menuType: "weapon", animation: "arrow", variant: "regular", color: "regular", enableCustom: false, customPath: "" }
    : { dbSection, menuType: "spell", animation: "curewounds", variant: "01", color: "blue", enableCustom: false, customPath: "" };
}

function extraDesligado() {
  return {
    enable: false,
    options: { addTokenWidth: false, anchor: "0.5", delay: 0, elevation: 1000, fadeIn: 250, fadeOut: 500, isWait: true,
               isMasked: false, isRadius: false, opacity: 1, repeat: 1, repeatDelay: 250, size: 1, zIndex: 1 },
    sound: somVazio(),
    video: videoPadrao("static")
  };
}

function opcoes(menu, g) {
  const base = { delay: 0, elevation: 1000, isWait: false, opacity: 1, repeat: g.repeat ?? 1, repeatDelay: g.repeatDelay ?? 0, zIndex: 1 };
  if (menu === "range") return { ...base, isReturning: false, onlyX: false };
  return { ...base, addTokenWidth: false, anchor: "0.5", fadeIn: 150, fadeOut: 300, isMasked: false, isRadius: false,
           persistent: false, playOn: "default", size: g.size ?? 1.5, unbindAlpha: false, unbindVisibility: false };
}

/** Uma entrada do menu de Reconhecimento Automático (formato v5 do AA) */
function entrada(rotulo, g) {
  const dbSection = g.menu === "range" ? "range" : "static";
  return {
    id: foundry.utils.randomID(),
    label: rotulo,
    isEnabled: true,
    isCustomized: true,
    fromAmmo: false,
    menu: g.menu,
    macro: { enable: false },
    advanced: { exactMatch: !!g.exato, excludedTerms: [] },
    levels3d: { enable: false, type: "", data: {}, secondary: { enable: false, data: {} }, sound: somVazio() },
    primary: {
      options: opcoes(g.menu, g),
      sound: { ...somVazio(), enable: !!g.som, file: g.som ? SOM(g.som) : "", volume: 0.6 },
      video: { ...videoPadrao(dbSection), enableCustom: true, customPath: VIDEO(g.video) }
    },
    secondary: g.secundario
      ? { ...extraDesligado(), enable: true, options: { ...extraDesligado().options, size: 2 },
          video: { ...videoPadrao("static"), enableCustom: true, customPath: VIDEO(g.secundario) } }
      : { ...extraDesligado(), options: { ...extraDesligado().options, isRadius: true, size: 1.5 } },
    soundOnly: { sound: somVazio() },
    source: extraDesligado(),
    target: extraDesligado()
  };
}

export function montarMenu() {
  const menu = { melee: [], range: [], ontoken: [], templatefx: [], aura: [], preset: [], aefx: [], version: VERSAO_MENU };
  for (const g of GRUPOS) for (const r of g.rotulos) menu[g.menu].push(entrada(r, g));
  return menu;
}

const MENUS = ["melee", "range", "ontoken", "templatefx", "aura", "preset"];
const rinse = s => String(s ?? "").replace(/\s+/g, "").toLowerCase();

/** Tira do AA as entradas com os rótulos do sistema (para reinstalar ou remover) */
async function removerDoAA() {
  const nossos = new Set(ROTULOS.map(rinse));
  let removidas = 0;
  for (const m of MENUS) {
    const atual = game.settings.get("autoanimations", `aaAutorec-${m}`) ?? [];
    const filtrado = atual.filter(e => !nossos.has(rinse(e.label)));
    removidas += atual.length - filtrado.length;
    if (filtrado.length !== atual.length) await game.settings.set("autoanimations", `aaAutorec-${m}`, filtrado);
  }
  return removidas;
}

export async function instalarNoAA() {
  const aa = globalThis.AutomatedAnimations?.AutorecManager;
  if (!game.modules.get("autoanimations")?.active || !aa?.mergeMenus) {
    return ui.notifications.warn("Ative o módulo Automated Animations (e o Sequencer) para instalar as animações.");
  }
  await removerDoAA();
  await aa.mergeMenus(montarMenu(), { range: true, ontoken: true });
  await game.settings.set(SISTEMA, "animacoesVersao", VERSAO_ANIMACOES);
  ui.notifications.info(`A Nova Ordem: ${ROTULOS.length} animações instaladas no Automated Animations.`);
}

export async function removerAnimacoes() {
  if (!game.modules.get("autoanimations")?.active) return ui.notifications.warn("O Automated Animations não está ativo.");
  const n = await removerDoAA();
  await game.settings.set(SISTEMA, "animacoesVersao", "removido");
  ui.notifications.info(`A Nova Ordem: ${n} animações do sistema removidas do Automated Animations.`);
}

/* =========================
 * JANELA DE CONFIGURAÇÃO
 * ========================= */
const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

class ConfigAnimacoes extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    id: "aon-config-animacoes",
    classes: ["a-nova-ordem", "aon-config-animacoes"],
    window: { title: "Animações do Sistema", icon: "fas fa-wand-magic-sparkles", resizable: true },
    position: { width: 560, height: 640 },
    actions: {
      instalar: async function () { await instalarNoAA(); this.render(); },
      remover: async function () { await removerAnimacoes(); this.render(); },
      previa: ConfigAnimacoes.#previa
    }
  };
  static PARTS = { main: { template: "systems/a-nova-ordem/templates/config-animacoes.hbs", scrollable: [".aon-anim-lista"] } };

  async _prepareContext() {
    const aa = game.modules.get("autoanimations");
    const ativo = !!aa?.active;
    const instalados = new Set();
    if (ativo) for (const m of MENUS) for (const e of game.settings.get("autoanimations", `aaAutorec-${m}`) ?? []) instalados.add(rinse(e.label));
    return {
      aa: { ativo, versao: aa?.version ?? "—", sequencer: !!game.modules.get("sequencer")?.active },
      grupos: GRUPOS.map(g => ({
        video: g.video, som: g.som, tipo: g.menu === "range" ? "Projétil" : "No alvo",
        caminho: VIDEO(g.video),
        rotulos: g.rotulos.map(r => ({ r, ok: instalados.has(rinse(r)) }))
      })),
      total: ROTULOS.length,
      instalados: ROTULOS.filter(r => instalados.has(rinse(r))).length
    };
  }

  static #previa(event, target) {
    const som = target.dataset.som;
    if (som) foundry.audio.AudioHelper.play({ src: SOM(som), volume: 0.6 }, false);
  }
}

/* O mestre recebe as animações sozinho ao abrir o mundo com o módulo ativo.
 * Quem clicou em "Remover" não recebe de novo. */
Hooks.once("ready", async () => {
  if (!game.users.activeGM?.isSelf || !game.modules.get("autoanimations")?.active) return;
  const instalada = game.settings.get(SISTEMA, "animacoesVersao");
  if (instalada === VERSAO_ANIMACOES || instalada === "removido") return;
  try {
    await instalarNoAA();
  } catch (err) {
    console.warn("A Nova Ordem | Falha ao instalar as animações:", err);
  }
});

export function registrarAnimacoes() {
  game.settings.register(SISTEMA, "animacoesVersao", { scope: "world", config: false, type: String, default: "" });
  game.settings.registerMenu(SISTEMA, "animacoesMenu", {
    name: "Animações do Sistema",
    label: "Configurar",
    hint: "Com o Automated Animations ativo, os efeitos e sons do sistema se instalam sozinhos. Aqui dá para ver, atualizar ou remover.",
    icon: "fas fa-wand-magic-sparkles",
    type: ConfigAnimacoes,
    restricted: true
  });
}
