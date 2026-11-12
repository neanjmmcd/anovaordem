/* =========================
 * MOLDURAS DE TOKEN
 * Monta o token de um ator: a imagem fica por trás de uma moldura redonda,
 * o usuário arrasta e dá zoom até o centro vazado mostrar a melhor parte,
 * e ao aplicar o resultado vira um .webp salvo no mundo e usado no token.
 * Abre pelo botão "Token" no topo da ficha ou pelo menu do ator na barra lateral.
 * ========================= */

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

const SISTEMA = "systems/a-nova-ordem";
const LISTA = `${SISTEMA}/assets/molduras/molduras.json`;
const PREVIA = 440;   // tamanho do desenho na janela (px)
const SAIDA = 768;    // tamanho do arquivo final (px)

/** Sem moldura: só recorta a imagem num círculo */
const SEM_MOLDURA = { id: "nenhuma", nome: "Sem moldura", arquivo: null, raio: 0.49 };

let molduras;
async function carregarMolduras() {
  if (molduras) return molduras;
  try {
    const lista = await (await fetch(LISTA)).json();
    molduras = [SEM_MOLDURA, ...lista.map(m => ({ ...m, arquivo: `${SISTEMA}/assets/molduras/${m.arquivo}` }))];
  } catch (err) {
    console.warn("A Nova Ordem | molduras não encontradas", err);
    molduras = [SEM_MOLDURA];
  }
  return molduras;
}

function carregarImagem(src) {
  return new Promise((ok, falha) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => ok(img);
    img.onerror = () => falha(new Error(`Não abriu a imagem ${src}`));
    img.src = src;
  });
}

const nomeArquivo = t => String(t ?? "token").normalize("NFD").replace(/[^\w\s-]/g, "")
  .trim().replace(/\s+/g, "-").toLowerCase().slice(0, 40) || "token";

export class AONovaOrdemMolduraToken extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    id: "aon-moldura-token",
    classes: ["a-nova-ordem", "aon-moldura-janela"],
    window: { title: "Token com moldura", icon: "fas fa-circle-user", resizable: false },
    position: { width: 780, height: "auto" },
    actions: {
      escolher: AONovaOrdemMolduraToken.#escolher,
      retrato: AONovaOrdemMolduraToken.#retrato,
      tokenAtual: AONovaOrdemMolduraToken.#tokenAtual,
      centralizar: AONovaOrdemMolduraToken.#centralizar,
      moldura: AONovaOrdemMolduraToken.#moldura,
      aplicar: AONovaOrdemMolduraToken.#aplicar
    }
  };
  static PARTS = { main: { template: `${SISTEMA}/templates/moldura-token.hbs`, scrollable: [".aon-moldura-lista"] } };

  /** @param {Actor} actor  @param {TokenDocument} [token] token da cena a atualizar também */
  constructor(actor, token, options) {
    super(options);
    this.actor = actor;
    this.token = token ?? null;
    this.molduraId = SEM_MOLDURA.id;
    this.fundo = { usar: false, cor: "#2b2620" };
    this.pos = { x: 0.5, y: 0.5, largura: 1 };
  }

  get title() { return `Token com moldura — ${this.actor.name}`; }

  static abrir(actor, token) {
    if (!actor?.isOwner) return ui.notifications.warn("Você não é dono deste ator.");
    const aberta = foundry.applications.instances.get("aon-moldura-token");
    if (aberta) aberta.close();
    return new AONovaOrdemMolduraToken(actor, token).render(true);
  }

  get moldura() { return molduras?.find(m => m.id === this.molduraId) ?? SEM_MOLDURA; }

  async _prepareContext() {
    const lista = await carregarMolduras();
    return {
      previa: PREVIA,
      molduras: lista.map(m => ({ ...m, ativa: m.id === this.molduraId })),
      fundo: this.fundo,
      podeEnviar: game.user.can("FILES_UPLOAD")
    };
  }

  async _onRender(context, options) {
    this.canvas = this.element.querySelector(".aon-moldura-previa");
    this.ctx = this.canvas.getContext("2d");

    if (options.isFirstRender) {
      const inicial = this.actor.img && !this.actor.img.includes("mystery-man") ? this.actor.img
        : this.actor.prototypeToken.texture.src;
      await this.#trocarImagem(inicial);
    }
    await this.#trocarMoldura(this.molduraId);

    // arrastar
    this.canvas.addEventListener("pointerdown", ev => {
      this.canvas.setPointerCapture(ev.pointerId);
      const inicio = { px: ev.clientX, py: ev.clientY, x: this.pos.x, y: this.pos.y };
      const mover = e => {
        this.pos.x = inicio.x + (e.clientX - inicio.px) / PREVIA;
        this.pos.y = inicio.y + (e.clientY - inicio.py) / PREVIA;
        this.#desenhar();
      };
      const soltar = () => {
        this.canvas.removeEventListener("pointermove", mover);
        this.canvas.removeEventListener("pointerup", soltar);
      };
      this.canvas.addEventListener("pointermove", mover);
      this.canvas.addEventListener("pointerup", soltar);
    });
    // zoom com a roda, em volta do ponto do mouse
    this.canvas.addEventListener("wheel", ev => {
      ev.preventDefault();
      const r = this.canvas.getBoundingClientRect();
      const mx = (ev.clientX - r.left) / r.width, my = (ev.clientY - r.top) / r.height;
      this.#zoom(Math.pow(1.1, -Math.sign(ev.deltaY) * (ev.shiftKey ? 0.25 : 1)), mx, my);
    }, { passive: false });

    const zoom = this.element.querySelector(".aon-moldura-zoom");
    zoom.addEventListener("input", () => {
      const alvo = this.#larguraBase() * Number(zoom.value) / 100;
      this.#zoom(alvo / this.pos.largura, 0.5, 0.5, false);
    });
    for (const campo of this.element.querySelectorAll("[data-fundo]")) {
      campo.addEventListener("input", () => {
        this.fundo[campo.dataset.fundo] = campo.type === "checkbox" ? campo.checked : campo.value;
        this.#desenhar();
      });
    }
    this.#desenhar();
  }

  /** largura que cobre exatamente o centro da moldura (zoom 100%) */
  #larguraBase() {
    if (!this.imagem) return 1;
    const d = 2 * this.moldura.raio;
    return d * Math.max(1, this.imagem.width / this.imagem.height);
  }

  #zoom(fator, cx = 0.5, cy = 0.5, atualizarBarra = true) {
    const base = this.#larguraBase();
    const nova = Math.min(base * 8, Math.max(base * 0.25, this.pos.largura * fator));
    fator = nova / this.pos.largura;
    this.pos.x = cx + (this.pos.x - cx) * fator;
    this.pos.y = cy + (this.pos.y - cy) * fator;
    this.pos.largura = nova;
    if (atualizarBarra) {
      const barra = this.element.querySelector(".aon-moldura-zoom");
      if (barra) barra.value = Math.round(nova / base * 100);
    }
    this.#desenhar();
  }

  #encaixar() {
    this.pos = { x: 0.5, y: 0.5, largura: this.#larguraBase() };
    const barra = this.element?.querySelector(".aon-moldura-zoom");
    if (barra) barra.value = 100;
  }

  async #trocarImagem(src) {
    if (!src) return;
    try {
      this.imagem = await carregarImagem(src);
      this.origem = src;
      this.#encaixar();
      this.#desenhar();
    } catch (err) {
      ui.notifications.error(err.message);
    }
  }

  async #trocarMoldura(id) {
    this.molduraId = id;
    const m = this.moldura;
    try {
      this.imagemMoldura = m.arquivo ? await carregarImagem(m.arquivo) : null;
    } catch (err) {
      this.imagemMoldura = null;
      ui.notifications.error(err.message);
    }
    for (const el of this.element?.querySelectorAll(".aon-moldura-opcao") ?? []) {
      el.classList.toggle("ativa", el.dataset.id === id);
    }
    this.#desenhar();
  }

  /** desenha o token num contexto de lado S; na prévia mostra a imagem apagada fora do centro */
  #pintar(ctx, S, previa) {
    const m = this.moldura, img = this.imagem;
    ctx.clearRect(0, 0, S, S);
    const larg = this.pos.largura * S;
    const alt = img ? larg * img.height / img.width : 0;
    const x = this.pos.x * S - larg / 2, y = this.pos.y * S - alt / 2;
    if (previa && img) {
      ctx.globalAlpha = 0.25;
      ctx.drawImage(img, x, y, larg, alt);
      ctx.globalAlpha = 1;
    }
    ctx.save();
    ctx.beginPath();
    ctx.arc(S / 2, S / 2, (m.raio + (m.arquivo ? 0.015 : 0)) * S, 0, Math.PI * 2);
    ctx.clip();
    if (previa) ctx.clearRect(0, 0, S, S);
    if (this.fundo.usar) { ctx.fillStyle = this.fundo.cor; ctx.fillRect(0, 0, S, S); }
    if (img) ctx.drawImage(img, x, y, larg, alt);
    ctx.restore();
    if (this.imagemMoldura) ctx.drawImage(this.imagemMoldura, 0, 0, S, S);
  }

  #desenhar() {
    if (this.ctx) this.#pintar(this.ctx, PREVIA, true);
  }

  static async #escolher() {
    const FP = foundry.applications.apps.FilePicker.implementation;
    new FP({ type: "image", current: this.origem, callback: src => this.#trocarImagem(src) }).render(true);
  }

  static #retrato() { return this.#trocarImagem(this.actor.img); }
  static #tokenAtual() { return this.#trocarImagem((this.token ?? this.actor.prototypeToken).texture.src); }
  static #centralizar() { this.#encaixar(); this.#desenhar(); }
  static #moldura(event, alvo) { return this.#trocarMoldura(alvo.dataset.id); }

  static async #aplicar(event, botao) {
    if (!this.imagem) return ui.notifications.warn("Escolha uma imagem primeiro.");
    if (!game.user.can("FILES_UPLOAD")) {
      return ui.notifications.warn("Você não tem permissão para enviar arquivos. Peça ao mestre para liberar em Configurar Permissões.");
    }
    botao.disabled = true;
    try {
      const tela = document.createElement("canvas");
      tela.width = tela.height = SAIDA;
      this.#pintar(tela.getContext("2d"), SAIDA, false);
      const blob = await new Promise(ok => tela.toBlob(ok, "image/webp", 0.9));
      const pasta = `worlds/${game.world.id}/tokens-a-nova-ordem`;
      const nome = `${nomeArquivo(this.actor.name)}-${Date.now().toString(36)}.webp`;
      const FP = foundry.applications.apps.FilePicker.implementation;
      try { await FP.createDirectory("data", pasta); } catch { /* já existe */ }
      const resp = await FP.upload("data", pasta, new File([blob], nome, { type: "image/webp" }), {}, { notify: false });
      if (!resp?.path) throw new Error("o envio do arquivo falhou");
      const caminho = resp.path;

      await this.actor.update({ "prototypeToken.texture.src": caminho, "prototypeToken.ring.enabled": false });
      // tokens já na cena: o escolhido e os ligados a este ator
      const tokens = new Set(this.token ? [this.token] : []);
      if (this.actor.prototypeToken.actorLink) {
        for (const t of this.actor.getActiveTokens(false, true)) tokens.add(t);
      }
      for (const t of tokens) {
        if (t.isOwner) await t.update({ "texture.src": caminho, "ring.enabled": false });
      }
      ui.notifications.info(`Token de ${this.actor.name} atualizado.`);
      this.close();
    } catch (err) {
      console.error(err);
      ui.notifications.error(`Não foi possível salvar o token: ${err.message}`);
      botao.disabled = false;
    }
  }
}

/* Botão "Token" no topo das fichas (fichas AppV1) */
Hooks.on("getActorSheetHeaderButtons", (sheet, botoes) => {
  if (!sheet.actor?.isOwner) return;
  botoes.unshift({
    label: "Token", class: "aon-moldura", icon: "fas fa-circle-user",
    onclick: () => AONovaOrdemMolduraToken.abrir(sheet.actor, sheet.token)
  });
});

/* Item no menu do ator na barra lateral */
function opcaoMenu(_app, opcoes) {
  opcoes.push({
    name: "Token com moldura",
    icon: '<i class="fas fa-circle-user"></i>',
    condition: li => game.actors.get((li[0] ?? li).dataset.entryId)?.isOwner,
    callback: li => AONovaOrdemMolduraToken.abrir(game.actors.get((li[0] ?? li).dataset.entryId))
  });
}
Hooks.on("getActorContextOptions", opcaoMenu);
