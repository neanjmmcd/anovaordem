/* =========================
 * CARTÃO ÚNICO DO CHAT
 * Mesmo visual para testes, ataques, dano e cura, do jogador e do mestre:
 * retrato, título, cálculo, linha colorida e resultado.
 * O bloco .aon-calculo some para os jogadores quando o mestre rola com
 * "Ocultar cálculo das rolagens do mestre" ligado (flag "ocultar").
 * ========================= */

const SISTEMA = "a-nova-ordem";

export const CORES = {
  sucesso: "#3c9a3c", falha: "#9a3c3c", critico: "#d4a017", falhaCritica: "#5a1010",
  dano: "red", cura: "green", neutro: "#7a5c2e"
};

/** Cor pelo grau do teste */
export function corDoGrau(g) {
  if (!g) return CORES.neutro;
  if (g.critico) return g.sucesso ? CORES.critico : CORES.falhaCritica;
  return g.sucesso ? CORES.sucesso : CORES.falha;
}

export function cartao({ img, titulo, subtitulo = "", calculo = "", resultado = "", cor = CORES.neutro, extra = "" }) {
  return `
    <div class="aon-card" style="--aon-cor:${cor}">
      <div class="aon-card-topo">
        ${img ? `<img src="${img}">` : ""}
        <div class="aon-card-titulo"><b>${titulo}</b>${subtitulo ? `<small>${subtitulo}</small>` : ""}</div>
      </div>
      ${calculo ? `<div class="aon-calculo">${calculo}</div>` : ""}
      <hr>
      ${resultado ? `<div class="aon-card-resultado">${resultado}</div>` : ""}
      ${extra}
    </div>`;
}

/** " → Alvo, Alvo 2" para o subtítulo quando há tokens marcados; vazio sem alvo */
export function textoAlvos(alvos = []) {
  const nomes = alvos.filter(Boolean).map(a => a.name);
  return nomes.length ? ` <i class="fas fa-crosshairs"></i> ${nomes.join(", ")}` : "";
}

/** O mestre está rolando com o cálculo oculto para os jogadores? */
export function ocultarCalculo() {
  if (!game.user.isGM) return false;
  const c = game.settings.get(SISTEMA, "combate") ?? {};
  return c.ocultarRolagemMestre ?? false;
}

/**
 * Cria a mensagem do cartão. Com cálculo oculto, os dados não vão junto
 * (o Dice So Nice mostraria o número), só o som de dados.
 */
export async function enviarCartao({ actor, html, rolls = [], flags = {} }) {
  const ocultar = ocultarCalculo();
  return ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor }),
    content: html,
    rolls: ocultar ? [] : rolls,
    sound: rolls.length ? CONFIG.sounds.dice : undefined,
    flags: { [SISTEMA]: { ...flags, ocultar } }
  });
}

/* Esconde o cálculo dos jogadores nas rolagens ocultas do mestre */
Hooks.on("renderChatMessageHTML", (message, html) => {
  if (game.user.isGM || !message.getFlag(SISTEMA, "ocultar")) return;
  html.querySelectorAll(".aon-calculo").forEach(el => el.remove());
});
