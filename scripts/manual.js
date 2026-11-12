/* =========================
 * MANUAL DO SISTEMA (dentro do Foundry)
 * Um único manual: o mestre vê tudo; os jogadores, só as seções deles
 * (as do mestre nem são montadas no HTML de quem não é mestre).
 * Abre pelo botão "Manual" nos controles de token, por Configurações
 * ou pelo atalho (sem tecla padrão; defina em Configurar Controles).
 * ========================= */

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

const normalizar = t => String(t ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export class AONovaOrdemManual extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    id: "aon-manual",
    classes: ["a-nova-ordem", "aon-manual-janela"],
    window: { title: "Manual do Sistema", icon: "fas fa-book-open", resizable: true },
    position: { width: 860, height: 700 }
  };
  static PARTS = { main: { template: "systems/a-nova-ordem/templates/manual.hbs", scrollable: [".aon-manual-corpo", ".aon-manual-indice"] } };

  static abrir() {
    const app = foundry.applications.instances.get("aon-manual") ?? new AONovaOrdemManual();
    return app.render({ force: true });
  }

  async _prepareContext() {
    return { gm: game.user.isGM };
  }

  _onRender(context, options) {
    const el = this.element;
    const corpo = el.querySelector(".aon-manual-corpo");
    const indice = el.querySelector(".aon-manual-indice");
    const secoes = [...el.querySelectorAll(".aon-manual-corpo section")];

    indice.replaceChildren(...secoes.map(sec => {
      const li = document.createElement("li");
      li.dataset.alvo = sec.dataset.secao;
      li.innerHTML = sec.querySelector("h2").innerHTML;
      if (sec.hasAttribute("data-gm")) li.classList.add("aon-manual-gm-item");
      li.addEventListener("click", () => corpo.scrollTo({ top: sec.offsetTop - corpo.offsetTop - 4, behavior: "smooth" }));
      return li;
    }));

    const busca = el.querySelector(".aon-manual-busca");
    busca.addEventListener("input", () => {
      const termo = normalizar(busca.value.trim());
      let algum = false;
      for (const sec of secoes) {
        const ok = !termo || normalizar(sec.textContent).includes(termo);
        sec.hidden = !ok;
        indice.querySelector(`[data-alvo="${sec.dataset.secao}"]`).hidden = !ok;
        algum ||= ok;
      }
      el.querySelector(".aon-manual-nada").hidden = algum;
    });
    if (options.isFirstRender) busca.focus();
  }
}

/** Suba este número quando o manual mudar muito: todos recebem a mensagem de novo */
const VERSAO_BOAS_VINDAS = 1;

export function registrarManual() {
  game.settings.register("a-nova-ordem", "boasVindas", {
    name: "Mensagem de boas-vindas",
    hint: "Na primeira vez que cada usuário entra, manda só para ele uma mensagem no chat mostrando onde fica o Manual do Sistema.",
    scope: "world", config: true, type: Boolean, default: true
  });
  game.settings.register("a-nova-ordem", "mensagemMestre", {
    scope: "world", config: false, type: Object, default: { titulo: "", texto: "", versao: 0 },
    onChange: () => entregarMensagemMestre()
  });
  game.settings.registerMenu("a-nova-ordem", "mensagemMestreMenu", {
    name: "Mensagem do Mestre",
    label: "Escrever mensagem",
    hint: "Recado ou regras da mesa. Cada jogador recebe no chat, só para ele: quem está online recebe ao salvar, quem entrar depois recebe ao entrar.",
    icon: "fas fa-scroll",
    type: MensagemMestreConfig,
    restricted: true
  });
  game.keybindings.register("a-nova-ordem", "manual", {
    name: "Abrir o Manual do Sistema",
    editable: [],
    onDown: () => { AONovaOrdemManual.abrir(); return true; }
  });
}

/* Janela da Mensagem do Mestre */
class MensagemMestreConfig extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    id: "aon-mensagem-mestre",
    tag: "form",
    classes: ["a-nova-ordem", "aon-mensagem-mestre-janela"],
    window: { title: "Mensagem do Mestre", icon: "fas fa-scroll" },
    position: { width: 560, height: "auto" },
    form: { handler: MensagemMestreConfig.#salvar, closeOnSubmit: true }
  };
  static PARTS = { main: { template: "systems/a-nova-ordem/templates/mensagem-mestre.hbs" } };

  async _prepareContext() {
    return game.settings.get("a-nova-ordem", "mensagemMestre");
  }

  static async #salvar(event, form, formData) {
    const atual = game.settings.get("a-nova-ordem", "mensagemMestre");
    const { titulo = "", texto = "", reenviar } = formData.object;
    const mudou = titulo.trim() !== (atual.titulo ?? "") || texto.trim() !== (atual.texto ?? "");
    const versao = (mudou || reenviar) && texto.trim() ? (atual.versao ?? 0) + 1 : (atual.versao ?? 0);
    await game.settings.set("a-nova-ordem", "mensagemMestre", { titulo: titulo.trim(), texto: texto.trim(), versao });
    if (versao > (atual.versao ?? 0)) ui.notifications.info("Mensagem salva. Os jogadores online já receberam; os outros recebem ao entrar.");
  }
}

/** Texto do mestre em parágrafos (linha em branco separa; quebra simples vira <br>) */
function paragrafos(texto) {
  return texto.split(/\n\s*\n/).map(p => `<p>${p.trim().replace(/\n/g, "<br>")}</p>`).join("");
}

/** Manda a mensagem do mestre para este jogador, se houver versão nova */
let entregando = false;
async function entregarMensagemMestre() {
  if (game.user.isGM || entregando) return;
  const msg = game.settings.get("a-nova-ordem", "mensagemMestre");
  if (!msg?.texto || !msg.versao) return;
  if ((game.user.getFlag("a-nova-ordem", "mensagemMestre") ?? 0) >= msg.versao) return;
  entregando = true;
  try {
    await game.user.setFlag("a-nova-ordem", "mensagemMestre", msg.versao);
    await ChatMessage.create({
      speaker: { alias: msg.titulo || "Recado do Mestre" },
      whisper: [game.user.id],
      flags: { "a-nova-ordem": { mensagemMestre: msg.versao } },
      content: `<div class="aon-boas-vindas aon-recado-mestre">
        <h3><i class="fas fa-scroll"></i> ${foundry.utils.escapeHTML(msg.titulo || "Recado do Mestre")}</h3>
        ${paragrafos(msg.texto)}
        <p class="aon-boas-vindas-nota">Só você vê esta mensagem.</p>
      </div>`
    });
  } finally {
    entregando = false;
  }
}

/* Botão nos controles de token, para todos */
Hooks.on("getSceneControlButtons", controls => {
  const tokens = controls.tokens ?? controls.token;
  if (!tokens?.tools) return;
  tokens.tools.aonManual = {
    name: "aonManual",
    title: "Manual do Sistema",
    icon: "fas fa-book-open",
    order: Object.keys(tokens.tools).length + 1,
    button: true,
    visible: true,
    onChange: () => AONovaOrdemManual.abrir()
  };
});

/* Botão na aba Configurações */
Hooks.on("renderSettings", (app, html) => {
  const raiz = html instanceof HTMLElement ? html : html[0];
  if (!raiz || raiz.querySelector(".aon-botao-manual")) return;
  const botao = document.createElement("button");
  botao.type = "button";
  botao.className = "aon-botao-manual";
  botao.innerHTML = `<i class="fas fa-book-open"></i> Manual do Sistema`;
  botao.addEventListener("click", ev => { ev.preventDefault(); AONovaOrdemManual.abrir(); });
  const ancora = raiz.querySelector('[data-app="configure"], [data-action="configure"]');
  if (ancora) ancora.before(botao);
  else raiz.querySelector("section, div")?.prepend(botao) ?? raiz.prepend(botao);
});

/* Boas-vindas: mensagem privada (só o próprio usuário vê), uma vez por usuário; depois, o recado do mestre */
Hooks.once("ready", async () => {
  await boasVindas();
  await entregarMensagemMestre();
});

async function boasVindas() {
  if (!game.settings.get("a-nova-ordem", "boasVindas")) return;
  if ((game.user.getFlag("a-nova-ordem", "boasVindas") ?? 0) >= VERSAO_BOAS_VINDAS) return;
  const icone = `<i class="fas fa-book-open"></i>`;
  const mestre = game.user.isGM
    ? `<p>Como mestre, você vê também as seções marcadas com <i class="fas fa-crown"></i>: configurações, Painel do Mestre, gerador de encontro e Bestiário.
       Em Configurar Sistema → <b>Mensagem do Mestre</b> você escreve um recado ou as regras da mesa para os jogadores.</p>`
    : "";
  await game.user.setFlag("a-nova-ordem", "boasVindas", VERSAO_BOAS_VINDAS);
  await ChatMessage.create({
    speaker: { alias: "A Nova Ordem" },
    whisper: [game.user.id],
    flags: { "a-nova-ordem": { boasVindas: true } },
    content: `<div class="aon-boas-vindas">
      <h3>${icone} Bem-vindo a A Nova Ordem, ${foundry.utils.escapeHTML(game.user.name)}!</h3>
      <p>Antes de jogar, dê uma olhada no <b>Manual do Sistema</b>: ficha, rolagens, combate, itens e atalhos, explicados dentro do Foundry.</p>
      <p>Ele fica no botão ${icone} <b>Manual</b>, na barra de controles de token (à esquerda da tela), e em Configurações → <b>Manual do Sistema</b>.</p>
      ${mestre}
      <button type="button" class="aon-abrir-manual">${icone} Abrir o Manual</button>
      <p class="aon-boas-vindas-nota">Só você vê esta mensagem.</p>
    </div>`
  });
}

Hooks.on("renderChatMessageHTML", (message, html) => {
  html.querySelector(".aon-abrir-manual")?.addEventListener("click", ev => {
    ev.preventDefault();
    AONovaOrdemManual.abrir();
  });
});
