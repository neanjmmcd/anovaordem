/* =========================
 * MUNDO PRONTO (configuração inicial)
 * Na primeira vez que o mestre abre um mundo, importa dos compêndios:
 *  - as Cenas Prontas (pasta "Cenas Prontas"); num mundo sem cenas, o Lobby vira a cena ativa;
 *  - os diários do mundo (pasta "O Mundo da Nova Ordem"), que os jogadores podem ler.
 * Roda uma vez por mundo (e de novo se VERSAO subir). O que já foi importado não é duplicado.
 * Configurar Sistema → "Mundo Pronto" desliga a importação automática ou importa de novo.
 * ========================= */

const SISTEMA = "a-nova-ordem";
/** Suba quando entrarem cenas ou diários novos nos compêndios: os mundos recebem só o que falta */
const VERSAO = 1;
const LOBBY = "CenaLobbyAON001";

const PASTAS = {
  cenas: { tipo: "Scene", nome: "Cenas Prontas", cor: "#7a5c2e" },
  mundo: { tipo: "JournalEntry", nome: "O Mundo da Nova Ordem", cor: "#7a5c2e" }
};

async function pasta({ tipo, nome, cor }) {
  return game.folders.find(f => f.type === tipo && f.name === nome)
    ?? Folder.create({ type: tipo, name: nome, color: cor });
}

/** Importa o que falta dos dois compêndios. Devolve quantos documentos entraram. */
export async function importarMundoPronto({ ativarLobby = false } = {}) {
  let novos = 0;
  for (const [nomePack, cfg] of Object.entries(PASTAS)) {
    const pack = game.packs.get(`${SISTEMA}.${nomePack}`);
    if (!pack) continue;
    const colecao = game.collections.get(cfg.tipo);
    const indice = await pack.getIndex();
    const faltam = indice.filter(e => !colecao.get(e._id));
    if (!faltam.length) continue;
    const destino = await pasta(cfg);
    // Diários: jogadores leem (Observador). Cenas: só o mestre mexe.
    const extra = cfg.tipo === "JournalEntry" ? { ownership: { default: CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER } } : {};
    for (const e of faltam) {
      await colecao.importFromCompendium(pack, e._id, { folder: destino.id, ...extra }, { keepId: true });
      novos++;
    }
  }
  if (ativarLobby) await game.scenes.get(LOBBY)?.activate();
  return novos;
}

export function registrarConfiguracaoInicial() {
  game.settings.register(SISTEMA, "mundoProntoVersao", { scope: "world", config: false, type: Number, default: 0 });
  game.settings.register(SISTEMA, "mundoProntoAuto", {
    name: "Mundo Pronto automático",
    hint: "Na primeira vez que o mestre abre o mundo, importa as Cenas Prontas (com o Lobby ativo, se o mundo não tiver cenas) e os diários de O Mundo da Nova Ordem.",
    scope: "world", config: true, type: Boolean, default: true
  });
  game.settings.registerMenu(SISTEMA, "mundoProntoMenu", {
    name: "Mundo Pronto",
    label: "Importar agora",
    hint: "Importa de novo as Cenas Prontas e os diários do mundo. Só entra o que não existe no mundo; nada é apagado.",
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
      content: "<p>Importar as Cenas Prontas e os diários de <b>O Mundo da Nova Ordem</b>? Só entra o que ainda não está no mundo.</p>"
    });
    if (!ok) return;
    const novos = await importarMundoPronto();
    ui.notifications.info(novos ? `Mundo Pronto: ${novos} documento(s) importado(s).` : "Mundo Pronto: tudo já estava no mundo.");
  }
}

Hooks.once("ready", async () => {
  if (!game.users.activeGM?.isSelf) return;
  if (!game.settings.get(SISTEMA, "mundoProntoAuto")) return;
  if (game.settings.get(SISTEMA, "mundoProntoVersao") >= VERSAO) return;
  try {
    const mundoVazio = game.scenes.size === 0;
    const novos = await importarMundoPronto({ ativarLobby: mundoVazio });
    await game.settings.set(SISTEMA, "mundoProntoVersao", VERSAO);
    if (novos) ui.notifications.info(`A Nova Ordem: ${novos} cena(s) e diário(s) importados (pastas "Cenas Prontas" e "O Mundo da Nova Ordem").`);
  } catch (err) {
    console.warn("A Nova Ordem | Falha no Mundo Pronto:", err);
  }
});
