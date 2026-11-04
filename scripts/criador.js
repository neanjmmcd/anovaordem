/* =========================
 * CRIADOR DE PERSONAGEM
 * Segue o manual: atributos em 3d6 (7 rolagens, distribuídas à
 * vontade) e 250 pontos somados aos valores base das perícias.
 * As rolagens vão para o chat; rolar de novo só com o mestre
 * liberando. O estado fica em flags["a-nova-ordem"].criacao.
 * ========================= */

const { ApplicationV2, HandlebarsApplicationMixin, DialogV2 } = foundry.applications.api;

const FLAG = "a-nova-ordem";
const ATRIBUTOS = ["for", "des", "con", "int", "sab", "psi", "car"];
const PONTOS = 250;
const DADOS = ["codinome", "idade", "pele", "olhos", "peso"];

/** Valor base da perícia (o inicial do modelo, em azul no manual) */
function base(key) {
  return Number(CONFIG.Actor.dataModels.personagem.schema.getField(`pericias.${key}.valor`)?.initial ?? 0);
}

export class AONovaOrdemCriador extends HandlebarsApplicationMixin(ApplicationV2) {

  static DEFAULT_OPTIONS = {
    classes: ["a-nova-ordem", "aon-criador"],
    window: { icon: "fas fa-user-plus", resizable: true },
    position: { width: 660, height: 780 },
    actions: {
      rolar: AONovaOrdemCriador.#rolar,
      liberar: AONovaOrdemCriador.#liberar,
      aplicar: AONovaOrdemCriador.#aplicar
    }
  };

  static PARTS = {
    main: { template: "systems/a-nova-ordem/templates/criador.hbs", scrollable: [".aon-cri-corpo"] }
  };

  static abrir(actor) {
    const id = `aon-criador-${actor.id}`;
    const app = foundry.applications.instances.get(id) ?? new AONovaOrdemCriador(actor, { id });
    app.render({ force: true });
    return app;
  }

  constructor(actor, options = {}) {
    super(options);
    this.actor = actor;
  }

  get title() {
    return `Criador de Personagem — ${this.actor.name}`;
  }

  get criacao() {
    return this.actor.getFlag(FLAG, "criacao") ?? {};
  }

  /** Escolhas ainda não aplicadas; sobrevivem às re-renderizações */
  rascunho = null;

  #rascunho() {
    if (this.rascunho) return this.rascunho;
    const s = this.actor.system;
    this.rascunho = {
      dados: { name: this.actor.name, ...Object.fromEntries(DADOS.map(k => [k, s[k] ?? ""])) },
      atribuicao: { ...(this.criacao.atribuicao ?? {}) },
      pericias: Object.fromEntries(Object.keys(CONFIG.AONOVAORDEM.pericias).map(k =>
        [k, Math.max(0, Number(s.pericias[k]?.valor ?? 0) - base(k))]
      ))
    };
    return this.rascunho;
  }

  #gasto() {
    return Object.values(this.#rascunho().pericias).reduce((t, v) => t + v, 0);
  }

  async _prepareContext() {
    const c = this.criacao;
    const r = this.#rascunho();
    const cfg = CONFIG.AONOVAORDEM;
    const rolagens = (c.rolagens ?? []).map((v, i) => ({ i: String(i), v }));
    const teto = Number(game.settings.get(FLAG, "tetoCriacao") ?? 0);

    const grupos = {};
    for (const [key, p] of Object.entries(cfg.pericias)) {
      const b = base(key), pontos = r.pericias[key] ?? 0;
      (grupos[p.grupo] ??= []).push({
        key, label: p.label, base: b, pontos, total: b + pontos,
        atr: p.atributos.map(a => a.toUpperCase()).join(" / "),
        acimaTeto: teto > 0 && b + pontos > teto
      });
    }
    for (const lista of Object.values(grupos)) lista.sort((a, b) => a.label.localeCompare(b.label, "pt-BR"));

    const gasto = this.#gasto();
    return {
      dados: r.dados,
      rolagens,
      somaRolagens: (c.rolagens ?? []).reduce((t, v) => t + v, 0),
      atributos: ATRIBUTOS.map(k => ({
        key: k,
        label: cfg.atributos[k]?.label ?? k.toUpperCase(),
        opcoes: rolagens.map(o => ({ ...o, selected: o.i === String(r.atribuicao[k] ?? "") }))
      })),
      podeRolar: !rolagens.length || c.rerrolar || game.user.isGM,
      aguardandoMestre: !!rolagens.length && !c.rerrolar && !game.user.isGM,
      isGM: game.user.isGM,
      grupos: Object.entries(grupos).map(([nome, lista]) => ({ nome, lista })),
      pontos: PONTOS, gasto, restante: PONTOS - gasto,
      teto,
      concluido: !!c.concluido,
      bloqueado: !!c.concluido && !game.user.isGM
    };
  }

  _onRender(context, options) {
    const el = this.element;
    const r = this.#rascunho();

    for (const campo of el.querySelectorAll("[data-dado]")) {
      campo.addEventListener("input", () => { r.dados[campo.dataset.dado] = campo.value; });
    }
    for (const sel of el.querySelectorAll("[data-atributo]")) {
      sel.addEventListener("change", () => {
        r.atribuicao[sel.dataset.atributo] = sel.value;
        this.#marcarUsados();
      });
    }
    for (const campo of el.querySelectorAll("[data-pericia]")) {
      campo.addEventListener("input", () => {
        const pontos = Math.max(0, Math.floor(Number(campo.value) || 0));
        r.pericias[campo.dataset.pericia] = pontos;
        const total = Number(campo.dataset.base) + pontos;
        const linha = campo.closest("tr");
        linha.querySelector(".aon-cri-total").textContent = `${total}%`;
        const teto = Number(context.teto);
        linha.classList.toggle("aon-cri-acima", teto > 0 && total > teto);
        this.#atualizarPontos();
      });
    }
    this.#marcarUsados();
    this.#atualizarPontos();
  }

  /** Cada resultado de 3d6 só pode ir para um atributo */
  #marcarUsados() {
    const sels = [...this.element.querySelectorAll("[data-atributo]")];
    const usados = new Set(sels.map(s => s.value).filter(v => v !== ""));
    for (const sel of sels) {
      for (const opt of sel.options) {
        opt.disabled = opt.value !== "" && opt.value !== sel.value && usados.has(opt.value);
      }
    }
  }

  #atualizarPontos() {
    const restante = PONTOS - this.#gasto();
    const el = this.element.querySelector(".aon-cri-restante");
    if (!el) return;
    el.textContent = restante;
    el.classList.toggle("aon-cri-negativo", restante < 0);
  }

  static async #rolar() {
    const c = this.criacao;
    if (c.rolagens?.length && !c.rerrolar && !game.user.isGM) {
      return ui.notifications.warn("Peça ao mestre para liberar uma nova rolagem.");
    }
    const rolls = [];
    for (let i = 0; i < ATRIBUTOS.length; i++) rolls.push(await new Roll("3d6").evaluate());
    const valores = rolls.map(r => r.total);
    const tentativa = Number(c.tentativas ?? 0) + 1;

    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      rolls,
      content: `
        <div class="chat-card aon-cri-chat">
          <b>Atributos de ${this.actor.name}</b> (3d6 ×7${tentativa > 1 ? ` · ${tentativa}ª rolagem` : ""})<br>
          <span class="aon-cri-valores">${valores.join(" · ")}</span><br>
          Soma: <b>${valores.reduce((t, v) => t + v, 0)}</b>
          <button type="button" class="aon-liberar-rolagem" data-actor-id="${this.actor.id}">
            <i class="fas fa-dice"></i> Liberar nova rolagem
          </button>
        </div>`
    });

    const k = `flags.${FLAG}.criacao`;
    await this.actor.update({
      [`${k}.rolagens`]: valores,
      [`${k}.rerrolar`]: false,
      [`${k}.tentativas`]: tentativa,
      [`${k}.-=atribuicao`]: null
    });
    this.#rascunho().atribuicao = {};
    this.render();
  }

  static async #liberar() {
    await AONovaOrdemCriador.liberarRolagem(this.actor);
  }

  /** Mestre libera nova rolagem (pelo criador ou pelo botão no chat) */
  static async liberarRolagem(actor) {
    if (!game.user.isGM || !actor) return;
    await actor.setFlag(FLAG, "criacao.rerrolar", true);
    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor }),
      content: `O mestre liberou uma nova rolagem de atributos para <b>${actor.name}</b>.`
    });
  }

  static async #aplicar() {
    const c = this.criacao;
    const r = this.#rascunho();
    if (c.concluido && !game.user.isGM) return ui.notifications.warn("Personagem já criado. Peça ao mestre para alterar.");

    const valores = c.rolagens ?? [];
    if (valores.length !== ATRIBUTOS.length) return ui.notifications.warn("Role os atributos primeiro.");
    const escolhas = ATRIBUTOS.map(k => String(r.atribuicao[k] ?? ""));
    if (escolhas.includes("")) return ui.notifications.warn("Distribua os 7 resultados entre os atributos.");
    if (new Set(escolhas).size !== ATRIBUTOS.length) return ui.notifications.warn("Cada resultado só pode ser usado uma vez.");

    const gasto = this.#gasto();
    if (gasto > PONTOS) return ui.notifications.warn(`Você gastou ${gasto} de ${PONTOS} pontos de perícia.`);
    const teto = Number(game.settings.get(FLAG, "tetoCriacao") ?? 0);
    if (teto > 0) {
      const acima = Object.entries(r.pericias)
        .filter(([k, p]) => base(k) + p > teto)
        .map(([k]) => CONFIG.AONOVAORDEM.pericias[k].label);
      if (acima.length) return ui.notifications.warn(`Acima do teto de ${teto}%: ${acima.join(", ")}.`);
    }
    if (gasto < PONTOS) {
      const ok = await DialogV2.confirm({
        window: { title: "Pontos sobrando" },
        content: `<p>Ainda restam <b>${PONTOS - gasto}</b> pontos de perícia. Concluir assim mesmo?</p>`
      });
      if (!ok) return;
    }

    const atributos = Object.fromEntries(ATRIBUTOS.map(k => [k, valores[Number(r.atribuicao[k])]]));
    const update = {
      name: r.dados.name || this.actor.name,
      "system.atributos": atributos,
      "system.saude": 100,
      "system.sanidade": 100,
      "system.essencia": atributos.psi * 2,
      [`flags.${FLAG}.criacao.concluido`]: true,
      [`flags.${FLAG}.criacao.atribuicao`]: { ...r.atribuicao }
    };
    for (const k of DADOS) update[`system.${k}`] = r.dados[k];
    for (const [k, p] of Object.entries(r.pericias)) update[`system.pericias.${k}.valor`] = base(k) + p;

    await this.actor.update(update);
    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content: `<b>${this.actor.name}</b> concluiu a criação de personagem.`
    });
    ui.notifications.info("Personagem criado.");
    this.close();
  }
}

/* Atualiza o criador aberto quando o mestre libera a rolagem */
Hooks.on("updateActor", (actor, changes) => {
  if (!foundry.utils.hasProperty(changes, `flags.${FLAG}.criacao`)) return;
  foundry.applications.instances.get(`aon-criador-${actor.id}`)?.render();
});

/* Botão "Liberar nova rolagem" no chat: só o mestre vê */
Hooks.on("renderChatMessageHTML", (message, html) => {
  const botao = html.querySelector(".aon-liberar-rolagem");
  if (!botao) return;
  if (!game.user.isGM) return botao.remove();
  botao.addEventListener("click", ev => {
    ev.preventDefault();
    AONovaOrdemCriador.liberarRolagem(game.actors.get(botao.dataset.actorId));
  });
});

/* Abre o criador para o jogador ao criar um personagem novo */
Hooks.on("createActor", (actor, options, userId) => {
  if (userId !== game.user.id || game.user.isGM) return;
  if (actor.type !== "personagem" || !game.settings.get(FLAG, "abrirCriador")) return;
  AONovaOrdemCriador.abrir(actor);
});
