/* =========================
 * MIGRAÇÕES DE DADOS
 * Custo de Essência dos implantes (2026-11): passou de % para pontos,
 * com a tabela nova do livro. Cada item convertido recebe a marca
 * flags.a-nova-ordem.custoEssencia = 2 e nunca é convertido de novo.
 * ========================= */

const SISTEMA = "a-nova-ordem";
const VERSAO_CUSTO = 2;
const CUSTO_NOVO = { 6: 2, 12: 4, 18: 10, 24: 12, 30: 16 };

/** Dados de atualização do implante, ou null se já está na tabela nova */
function converterImplante(item) {
  if (item.type !== "implantes") return null;
  if ((item.flags?.[SISTEMA]?.custoEssencia ?? 0) >= VERSAO_CUSTO) return null;
  const antigo = Number(item.system?.essencia ?? 0);
  const marca = { [`flags.${SISTEMA}.custoEssencia`]: VERSAO_CUSTO };
  return antigo in CUSTO_NOVO ? { _id: item._id ?? item.id, "system.essencia": CUSTO_NOVO[antigo], ...marca }
                              : { _id: item._id ?? item.id, ...marca };
}

async function migrarItensDoAtor(actor) {
  const updates = actor.items.map(converterImplante).filter(Boolean);
  if (updates.length) await actor.updateEmbeddedDocuments("Item", updates);
  return updates.length;
}

async function migrarCustoEssencia() {
  let n = 0;
  for (const actor of game.actors) n += await migrarItensDoAtor(actor);
  const soltos = game.items.map(converterImplante).filter(Boolean);
  if (soltos.length) await Item.implementation.updateDocuments(soltos);
  n += soltos.length;
  // Tokens não vinculados guardam itens próprios
  for (const scene of game.scenes) {
    for (const token of scene.tokens) {
      if (!token.actorLink && token.actor) n += await migrarItensDoAtor(token.actor);
    }
  }
  return n;
}

Hooks.once("ready", async () => {
  if (!game.users.activeGM?.isSelf) return;
  if (game.settings.get(SISTEMA, "migracaoCustoEssencia") >= VERSAO_CUSTO) return;
  try {
    const n = await migrarCustoEssencia();
    await game.settings.set(SISTEMA, "migracaoCustoEssencia", VERSAO_CUSTO);
    if (n) ui.notifications.info(`A Nova Ordem: ${n} implante(s) convertidos para o novo custo de Essência (em pontos).`, { permanent: true });
  } catch (err) {
    console.error("A Nova Ordem | Falha ao converter o custo de Essência dos implantes:", err);
    ui.notifications.error("A Nova Ordem: falha ao converter o custo de Essência dos implantes. Veja o console (F12).");
  }
});

/* Implante trazido de um compêndio antigo do mundo (cópia de antes da mudança):
 * converte ao entrar. Implantes criados à mão ou do compêndio do sistema não são tocados. */
Hooks.on("preCreateItem", (item, data) => {
  if (item.type !== "implantes") return;
  if ((item.flags?.[SISTEMA]?.custoEssencia ?? 0) >= VERSAO_CUSTO) return;
  const origem = item._stats?.compendiumSource ?? item.flags?.core?.sourceId ?? "";
  if (!origem.startsWith("Compendium.") || origem.startsWith(`Compendium.${SISTEMA}.`)) return;
  const antigo = Number(item.system.essencia ?? 0);
  const mudancas = { [`flags.${SISTEMA}.custoEssencia`]: VERSAO_CUSTO };
  if (antigo in CUSTO_NOVO) mudancas["system.essencia"] = CUSTO_NOVO[antigo];
  item.updateSource(mudancas);
});

export function registrarMigracoes() {
  game.settings.register(SISTEMA, "migracaoCustoEssencia", { scope: "world", config: false, type: Number, default: 0 });
}
