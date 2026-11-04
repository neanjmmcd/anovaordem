/* =========================
 * CATÁLOGO DE ITENS
 * Busca em todos os compêndios de itens e nos itens do mundo.
 * Abre por Ctrl+Espaço, pela lupa na ficha ou pelo botão na aba Itens.
 * A filtragem é feita no navegador (sem re-renderizar), então a
 * digitação não perde o foco.
 * ========================= */

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

const CAMPOS_INDICE = ["system.preco", "system.peso", "system.tipo", "system.efeito", "system.dano"];

// Campos mostrados no cartão do chat, na ordem
const CAMPOS_CHAT = [
  ["tipo", "Tipo"], ["dano", "Dano"], ["rd", "RD"], ["circulo", "Círculo"],
  ["essencia", "Essência"], ["efeito", "Efeito"], ["colateral", "Colateral"],
  ["conceito", "Conceito"], ["peso", "Peso"], ["preco", "Preço"]
];

export class AONovaOrdemCatalogo extends HandlebarsApplicationMixin(ApplicationV2) {

  static DEFAULT_OPTIONS = {
    id: "aon-catalogo",
    classes: ["a-nova-ordem", "aon-catalogo"],
    window: { title: "Catálogo de Itens", icon: "fas fa-magnifying-glass", resizable: true },
    position: { width: 760, height: 640 },
    actions: {
      abrir: AONovaOrdemCatalogo.#abrir,
      chat: AONovaOrdemCatalogo.#chat,
      adicionar: AONovaOrdemCatalogo.#adicionar,
      limpar: AONovaOrdemCatalogo.#limpar,
      recarregar: AONovaOrdemCatalogo.#recarregar
    }
  };

  static PARTS = {
    main: { template: "systems/a-nova-ordem/templates/catalogo.hbs", scrollable: [".aon-cat-lista"] }
  };

  /** Abre (ou traz para frente) o catálogo; com ator, "Adicionar" vai para ele */
  static abrir(actor = null) {
    const app = foundry.applications.instances.get("aon-catalogo") ?? new AONovaOrdemCatalogo();
    app.actor = actor;
    app.render({ force: true });
    return app;
  }

  actor = null;
  filtros = { texto: "", tipo: "", fonte: "", precoMax: "", pesoMax: "" };
  #entradas = null;

  /** Ator que recebe os itens: o da ficha, o token selecionado ou o personagem do jogador */
  get alvo() {
    return this.actor ?? canvas?.tokens?.controlled[0]?.actor ?? game.user.character ?? null;
  }

  async #carregar() {
    const cfg = CONFIG.AONOVAORDEM;
    const entradas = [];
    const add = (doc, fonte) => entradas.push({
      uuid: doc.uuid,
      nome: doc.name,
      img: doc.img,
      tipo: doc.type,
      tipoLabel: cfg.tiposItem[doc.type] ?? doc.type,
      preco: Number(foundry.utils.getProperty(doc, "system.preco") ?? 0),
      peso: Number(foundry.utils.getProperty(doc, "system.peso") ?? 0),
      busca: [doc.name, foundry.utils.getProperty(doc, "system.tipo"), foundry.utils.getProperty(doc, "system.efeito")]
        .filter(v => typeof v === "string").join(" ").toLowerCase(),
      fonte
    });

    for (const pack of game.packs.filter(p => p.documentName === "Item" && p.visible)) {
      const indice = await pack.getIndex({ fields: CAMPOS_INDICE });
      for (const e of indice) add({ ...e, uuid: e.uuid ?? `Compendium.${pack.collection}.Item.${e._id}` }, pack.title);
    }
    for (const item of game.items.filter(i => i.visible)) add(item, "Mundo");

    entradas.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
    return entradas;
  }

  async _prepareContext() {
    this.#entradas ??= await this.#carregar();
    const tipos = [...new Set(this.#entradas.map(e => e.tipo))]
      .map(t => ({ valor: t, label: CONFIG.AONOVAORDEM.tiposItem[t] ?? t }))
      .sort((a, b) => a.label.localeCompare(b.label, "pt-BR"));
    const fontes = [...new Set(this.#entradas.map(e => e.fonte))].sort();
    const podeAdicionar = game.user.isGM || game.settings.get("a-nova-ordem", "catalogoJogadores");
    return {
      entradas: this.#entradas,
      tipos, fontes,
      filtros: this.filtros,
      podeAdicionar,
      alvo: this.alvo?.name ?? null
    };
  }

  _onRender(context, options) {
    const el = this.element;
    for (const campo of el.querySelectorAll("[data-filtro]")) {
      campo.addEventListener("input", () => {
        this.filtros[campo.dataset.filtro] = campo.value;
        this.#filtrar();
      });
    }
    // Arrastar para a ficha (a ficha trata o drop de Item por uuid)
    for (const li of el.querySelectorAll(".aon-cat-item")) {
      li.addEventListener("dragstart", ev => {
        ev.dataTransfer.setData("text/plain", JSON.stringify({ type: "Item", uuid: li.dataset.uuid }));
      });
    }
    this.#filtrar();
    el.querySelector('[data-filtro="texto"]')?.focus();
  }

  #filtrar() {
    const f = this.filtros;
    const texto = f.texto.trim().toLowerCase();
    const precoMax = f.precoMax === "" ? Infinity : Number(f.precoMax);
    const pesoMax = f.pesoMax === "" ? Infinity : Number(f.pesoMax);
    let visiveis = 0;
    for (const li of this.element.querySelectorAll(".aon-cat-item")) {
      const d = li.dataset;
      const ok = (!texto || d.busca.includes(texto))
        && (!f.tipo || d.tipo === f.tipo)
        && (!f.fonte || d.fonte === f.fonte)
        && Number(d.preco) <= precoMax
        && Number(d.peso) <= pesoMax;
      li.hidden = !ok;
      if (ok) visiveis++;
    }
    const contador = this.element.querySelector(".aon-cat-contador");
    if (contador) contador.textContent = `${visiveis} ${visiveis === 1 ? "item" : "itens"}`;
  }

  static async #abrir(event, target) {
    const item = await fromUuid(target.closest("[data-uuid]").dataset.uuid);
    item?.sheet.render(true);
  }

  static async #chat(event, target) {
    const item = await fromUuid(target.closest("[data-uuid]").dataset.uuid);
    if (!item) return;
    const s = item.system;
    const linhas = CAMPOS_CHAT
      .filter(([k]) => s[k] !== undefined && s[k] !== "" && s[k] !== null)
      .map(([k, label]) => `<li><b>${label}:</b> ${s[k]}</li>`)
      .join("");
    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this.alvo }),
      content: `
        <div class="chat-item">
          <h2>${item.name}</h2>
          <img src="${item.img}">
          <ul><li><b>Categoria:</b> ${CONFIG.AONOVAORDEM.tiposItem[item.type] ?? item.type}</li>${linhas}</ul>
        </div>`
    });
  }

  static async #adicionar(event, target) {
    const actor = this.alvo;
    if (!actor) return ui.notifications.warn("Abra o catálogo pela ficha, selecione um token ou tenha um personagem atribuído.");
    if (!actor.isOwner) return ui.notifications.warn(`Você não pode editar ${actor.name}.`);
    const item = await fromUuid(target.closest("[data-uuid]").dataset.uuid);
    if (!item) return;

    // Itens empilháveis: soma à pilha existente em vez de duplicar
    if (CONFIG.AONOVAORDEM.tiposEmpilhaveis.includes(item.type)) {
      const existente = actor.items.find(i => i.type === item.type && i.name === item.name);
      if (existente) {
        const qtd = Number(existente.system.quantidade ?? 1) + Number(item.system.quantidade ?? 1);
        await existente.update({ "system.quantidade": qtd });
        return ui.notifications.info(`${item.name} ×${qtd} em ${actor.name}.`);
      }
    }
    await actor.createEmbeddedDocuments("Item", [item.toObject()]);
    ui.notifications.info(`${item.name} adicionado a ${actor.name}.`);
  }

  static #recarregar() {
    this.#entradas = null;
    this.render();
  }

  static #limpar() {
    this.filtros = { texto: "", tipo: "", fonte: "", precoMax: "", pesoMax: "" };
    for (const campo of this.element.querySelectorAll("[data-filtro]")) campo.value = "";
    this.#filtrar();
  }
}
