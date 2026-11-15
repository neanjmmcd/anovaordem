/* =========================
 * MUNDO PRONTO (configuração inicial)
 * Na primeira vez que o mestre abre um mundo, importa dos compêndios:
 *  - as Cenas Prontas (pasta "Cenas Prontas"); num mundo sem cenas, o Lobby vira a cena ativa;
 *  - os diários do mundo (pasta "O Mundo da Nova Ordem"), que os jogadores podem ler;
 *  - as playlists da trilha sonora (pasta "Trilha da Nova Ordem").
 * Roda uma vez por mundo (e de novo se VERSAO subir). O que já foi importado não é duplicado.
 * Configurar Sistema → "Mundo Pronto" desliga a importação automática ou importa de novo.
 * ========================= */

const SISTEMA = "a-nova-ordem";
/** Suba quando entrarem cenas ou diários novos nos compêndios: os mundos recebem só o que falta */
const VERSAO = 2; // 2: playlists da trilha sonora
const LOBBY = "CenaLobbyAON0001";

const PASTAS = {
  cenas: { tipo: "Scene", nome: "Cenas Prontas", cor: "#7a5c2e" },
  mundo: { tipo: "JournalEntry", nome: "O Mundo da Nova Ordem", cor: "#7a5c2e" }
};

async function pasta({ tipo, nome, cor }) {
  return game.folders.find(f => f.type === tipo && f.name === nome)
    ?? Folder.create({ type: tipo, name: nome, color: cor });
}

/** Importa o que falta dos dois compêndios. Devolve quantos documentos entraram e se todos os compêndios foram achados. */
export async function importarMundoPronto({ ativarLobby = false } = {}) {
  let novos = 0;
  let completo = true;
  for (const [nomePack, cfg] of Object.entries(PASTAS)) {
    const pack = game.packs.get(`${SISTEMA}.${nomePack}`);
    if (!pack) {
      completo = false;
      console.warn(`A Nova Ordem | Mundo Pronto: compêndio ${SISTEMA}.${nomePack} não encontrado.`);
      continue;
    }
    try {
      const colecao = game.collections.get(cfg.tipo);
      const destino = await pasta(cfg);
      await removerDuplicados(colecao, destino);
      const indice = await pack.getIndex();
      // Já existe se tiver o mesmo id, veio deste registro do compêndio ou tem o mesmo nome
      // (versões antigas trocavam o id na importação, então o nome é o que sobra)
      const existe = e => colecao.get(e._id) || colecao.some(d =>
        d._stats?.compendiumSource === e.uuid || d.name === e.name);
      const faltam = indice.filter(e => !existe(e));
      // Diários: jogadores leem (Observador). Cenas: só o mestre mexe.
      const extra = cfg.tipo === "JournalEntry" ? { ownership: { default: CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER } } : {};
      for (const e of faltam) {
        await colecao.importFromCompendium(pack, e._id, { folder: destino.id, ...extra }, { keepId: true });
        novos++;
      }
    } catch (err) {
      completo = false;
      console.warn(`A Nova Ordem | Mundo Pronto: falha ao importar ${SISTEMA}.${nomePack}:`, err);
    }
  }
  try { novos += await criarTrilhas(); }
  catch (err) { completo = false; console.warn("A Nova Ordem | Mundo Pronto: falha ao criar as playlists:", err); }
  await corrigirFundosV14();
  if (ativarLobby) await (game.scenes.get(LOBBY) ?? game.scenes.getName("Lobby — Pátio de Treino"))?.activate();
  return { novos, completo };
}

/**
 * Conserta mundos em que o Mundo Pronto importou a mesma cena/diário várias vezes:
 * na pasta do sistema, fica a cópia mais antiga de cada nome; as outras só saem se
 * estiverem intactas (sem tokens, paredes, luzes, notas, desenhos, tiles, sons ou regiões
 * nas cenas). Fora da pasta, nada é tocado.
 */
async function removerDuplicados(colecao, destino) {
  const EMBUTIDOS = ["tokens", "walls", "lights", "notes", "drawings", "tiles", "sounds", "regions"];
  const intacta = d => d.documentName !== "Scene" || EMBUTIDOS.every(c => !(d[c]?.size));
  const porNome = new Map();
  for (const d of colecao.filter(d => d.folder?.id === destino.id)) {
    if (!porNome.has(d.name)) porNome.set(d.name, []);
    porNome.get(d.name).push(d);
  }
  const apagar = [];
  for (const docs of porNome.values()) {
    if (docs.length < 2) continue;
    docs.sort((a, b) => (a._stats?.createdTime ?? 0) - (b._stats?.createdTime ?? 0));
    const [, ...copias] = docs;
    for (const d of copias) if (intacta(d) && !d.active) apagar.push(d.id);
  }
  if (!apagar.length) return;
  await colecao.documentClass.deleteDocuments(apagar);
  console.log(`A Nova Ordem | Mundo Pronto: ${apagar.length} cópia(s) repetida(s) removida(s) da pasta ${destino.name}.`);
  ui.notifications.info(`A Nova Ordem: ${apagar.length} cópia(s) repetida(s) removida(s) da pasta "${destino.name}".`);
}

/* Trilha sonora (pasta trilhasonora/ do sistema), separada por clima */
const TRILHAS = {
  "Combate": ["combate_dieselpunk", "chefe_maquina_de_guerra", "chefe_maquina_de_guerra_2", "perseguicao_veiculos", "perseguicao_veiculos_2"],
  "Cidade e Viagem": ["cidade_industrial", "exploracao_steampunk", "tema_steampunk", "viagem_dirigivel", "terra_devastada", "fabrica_do_regime", "marcha_imperial", "marcha_ao_trono"],
  "Tensão e Mistério": ["espera_tensa", "tensao_dieselpunk", "infiltracao_furtiva_2", "investigacao_noir", "frio_sob_a_pele", "registro_abandonado", "arquivo_do_regime", "ocultismo_projeto_tita", "prisao_de_ferro", "laboratorio_alquimico", "laboratorio_clinico"],
  "Lugares": ["clube_clandestino", "mercado_negro", "esconderijo_resistencia"],
  "Desfecho": ["vitoria_resistencia", "derrota_luto"]
};

/** "chefe_maquina_de_guerra_2" → "Chefe Maquina de Guerra 2" */
const nomeFaixa = arq => arq.split("_").map((p, i) => (i && ["de", "do", "da", "a", "ao", "sob"].includes(p)) ? p : p[0].toUpperCase() + p.slice(1)).join(" ");

/** Cria as playlists que faltam e acrescenta faixas novas. Devolve quantas playlists/faixas entraram. */
async function criarTrilhas() {
  let novos = 0;
  const destino = await pasta({ tipo: "Playlist", nome: "Trilha da Nova Ordem", cor: "#7a5c2e" });
  for (const [nome, faixas] of Object.entries(TRILHAS)) {
    const sons = faixas.map(arq => ({
      name: nomeFaixa(arq), path: `systems/${SISTEMA}/trilhasonora/${arq}.ogg`,
      repeat: true, volume: 0.5, channel: "music"
    }));
    const lista = game.playlists.find(p => p.name === nome && p.folder?.id === destino.id);
    if (!lista) {
      // Modo "só trilha": o mestre clica na faixa e ela toca em loop
      await Playlist.create({ name: nome, folder: destino.id, mode: CONST.PLAYLIST_MODES.DISABLED, channel: "music", sounds: sons });
      novos++;
      continue;
    }
    const faltam = sons.filter(s => !lista.sounds.some(x => x.path === s.path));
    if (faltam.length) { await lista.createEmbeddedDocuments("PlaylistSound", faltam); novos += faltam.length; }
  }
  return novos;
}

/* Mapa de cada Cena Pronta (mesmo que ferramentas/mundo_cenas.mjs): id, nome, arquivo.
 * O nome serve para cenas importadas à mão do compêndio, que ganham id aleatório. */
const MAPAS = [
  ["CenaLobbyAON0001", "Lobby — Pátio de Treino", "lobby.webp"],
  ["CenaLobbyAON0002", "Lobby — Pátio de Treino (inclinado)", "lobby_inclinado.webp"],
  ["CenaCasaAON00001", "Casa Comum", "casa.webp"],
  ["CenaBoateAON0001", "Boate", "boate.webp"],
  ["CenaGalpaoAON001", "Galpão / Fábrica Velha", "galpao.webp"],
  ["CenaGalpaoAON002", "Galpão / Fábrica Velha (inclinado)", "galpao_inclinado.webp"],
  ["CenaGalpaoAON003", "Galpão / Fábrica Velha (inclinado, com terreno)", "galpao_inclinado_externo.webp"]
];

/**
 * Foundry 14: a imagem de fundo passou da cena para os Níveis (Levels). As cenas do compêndio
 * foram feitas no 13 e chegam sem fundo; aqui o mapa vai para o primeiro nível (ou um nível novo).
 * Só mexe em nível sem imagem, então não desfaz o que o mestre escolheu.
 */
async function corrigirFundosV14() {
  if ((game.release?.generation ?? 13) < 14) return;
  for (const [id, nome, arq] of MAPAS) {
    const src = `systems/${SISTEMA}/assets/mapas/${arq}`;
    const cenas = game.scenes.filter(c => c.id === id || c.name === nome);
    for (const cena of cenas) {
      try {
        const niveis = cena.levels;
        const nivel = niveis?.get?.(cena.initialLevel) ?? niveis?.contents?.[0];
        if (nivel) {
          if (!nivel.background?.src) await nivel.update({ "background.src": src });
        } else {
          await cena.createEmbeddedDocuments("Level", [{ name: cena.name, background: { src } }]);
        }
      } catch (err) {
        console.warn(`A Nova Ordem | Não foi possível pôr o mapa na cena ${cena.name}:`, err);
      }
    }
  }
}

export function registrarConfiguracaoInicial() {
  game.settings.register(SISTEMA, "mundoProntoVersao", { scope: "world", config: false, type: Number, default: 0 });
  game.settings.register(SISTEMA, "mundoProntoAuto", {
    name: "Mundo Pronto automático",
    hint: "Na primeira vez que o mestre abre o mundo, importa as Cenas Prontas (com o Lobby ativo, se o mundo não tiver cenas), os diários de O Mundo da Nova Ordem e as playlists da trilha sonora.",
    scope: "world", config: true, type: Boolean, default: true
  });
  game.settings.registerMenu(SISTEMA, "mundoProntoMenu", {
    name: "Mundo Pronto",
    label: "Importar agora",
    hint: "Importa de novo as Cenas Prontas, os diários do mundo e as playlists da trilha sonora. Só entra o que não existe no mundo; nada é apagado.",
    icon: "fas fa-map",
    type: ImportarAgora,
    restricted: true
  });
}

/* Botão do menu: confirma e importa (não abre janela própria) */
class ImportarAgora {
  async render() {
    const ok = await foundry.applications.api.DialogV2.confirm({
      window: { title: "Mundo Pronto" },
      content: "<p>Importar as Cenas Prontas, os diários de <b>O Mundo da Nova Ordem</b> e as playlists da trilha sonora? Só entra o que ainda não está no mundo.</p>"
    });
    if (!ok) return;
    const { novos, completo } = await importarMundoPronto();
    if (!completo) ui.notifications.warn("Mundo Pronto: algum compêndio do sistema não foi encontrado (veja o console, F12).");
    else ui.notifications.info(novos ? `Mundo Pronto: ${novos} documento(s) importado(s).` : "Mundo Pronto: tudo já estava no mundo.");
  }
}

Hooks.once("ready", async () => {
  if (!game.users.activeGM?.isSelf) return;
  // Foundry 14: repõe o mapa das Cenas Prontas que ficaram sem fundo (roda sempre, não duplica)
  await corrigirFundosV14().catch(err => console.warn("A Nova Ordem | Falha ao corrigir fundos:", err));
  if (!game.settings.get(SISTEMA, "mundoProntoAuto")) return;
  if (game.settings.get(SISTEMA, "mundoProntoVersao") >= VERSAO) return;
  try {
    const mundoVazio = game.scenes.size === 0;
    const { novos, completo } = await importarMundoPronto({ ativarLobby: mundoVazio });
    // Só marca como feito se os compêndios existiam; senão tenta de novo na próxima abertura
    if (completo) await game.settings.set(SISTEMA, "mundoProntoVersao", VERSAO);
    if (novos) ui.notifications.info(`A Nova Ordem: ${novos} cena(s), diário(s) e playlist(s) importados (pastas "Cenas Prontas", "O Mundo da Nova Ordem" e "Trilha da Nova Ordem").`);
  } catch (err) {
    console.warn("A Nova Ordem | Falha no Mundo Pronto:", err);
  }
});
