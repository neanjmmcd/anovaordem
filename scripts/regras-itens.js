/* =========================
 * REGRAS DE ITENS NA FICHA
 * - Armaduras: no máximo 2 equipadas (RD e penalidades somam, ver modificadores.js).
 * - Consumíveis (drogas, elixires, injeções): o último, ao terminar o efeito, sai da ficha.
 *   Armas sem munição continuam na ficha.
 * - Implantes: não entram se a Essência não aguenta o custo (em pontos).
 * ========================= */

import { MAX_ARMADURAS } from "./modificadores.js";

const CONSUMIVEIS = ["drogas", "elixires", "injecoes"];

const armadurasEquipadas = (actor, exceto) =>
  actor.items.filter(i => i.type === "armadura" && i.system.equipado !== false && i.id !== exceto).length;

/** Essência que ainda sobra para implantes: PSI x2 menos o que os implantes já tiram */
function essenciaLivre(actor) {
  const sys = actor.system;
  const psi = Number(sys.atributosTotais?.psi ?? sys.atributos?.psi ?? 0);
  return psi * 2 - Number(sys.drenoEssencia ?? 0);
}

Hooks.on("preCreateItem", (item, data, options) => {
  const actor = item.parent;
  if (actor?.documentName !== "Actor" || actor.type !== "personagem") return;

  // Terceira armadura entra desequipada
  if (item.type === "armadura" && item.system.equipado !== false && armadurasEquipadas(actor) >= MAX_ARMADURAS) {
    item.updateSource({ "system.equipado": false });
    ui.notifications.info(`${item.name} entrou desequipada: ${actor.name} já usa ${MAX_ARMADURAS} armaduras.`);
  }

  // Implante que zeraria a Essência não entra
  if (item.type === "implantes") {
    const custo = Number(item.system.essencia ?? 0);
    const livre = essenciaLivre(actor);
    if (custo > 0 && custo >= livre) {
      ui.notifications.warn(`${actor.name} não tem Essência para ${item.name}: custa ${custo} e restam ${Math.max(0, livre)} `
        + `(a Essência zeraria, e com ela a personagem).`);
      return false;
    }
  }
});

Hooks.on("preUpdateItem", (item, changes) => {
  const actor = item.parent;
  if (actor?.documentName !== "Actor") return;
  if (item.type === "armadura" && foundry.utils.getProperty(changes, "system.equipado") === true
      && item.system.equipado === false && armadurasEquipadas(actor, item.id) >= MAX_ARMADURAS) {
    ui.notifications.warn(`No máximo ${MAX_ARMADURAS} armaduras equipadas. Desequipe uma antes.`);
    actor.sheet?.render(false);
    return false;
  }
});

Hooks.on("updateItem", (item, changes, options, userId) => {
  if (userId !== game.user.id) return;
  const actor = item.parent;
  if (actor?.documentName !== "Actor") return;

  // Consumível que acabou: ao desativar (fim do efeito ou à mão), sai da ficha
  if (CONSUMIVEIS.includes(item.type) && foundry.utils.getProperty(changes, "system.ativo") === false
      && Number(item.system.quantidade ?? 1) < 1) {
    item.delete();
    return;
  }
  // Implante com custo alterado: a Essência atual não passa da máxima
  if (item.type === "implantes") ajustarEssencia(actor);
});

Hooks.on("createItem", (item, options, userId) => {
  if (userId !== game.user.id || item.type !== "implantes" || item.parent?.documentName !== "Actor") return;
  ajustarEssencia(item.parent);
});

function ajustarEssencia(actor) {
  const atual = Number(actor.system.essencia ?? 0);
  const max = Number(actor.system.essenciaMax ?? atual);
  if (atual > max) actor.update({ "system.essencia": max });
}
