import { AONovaOrdemActorSheet } from "./sheet.js";
import { AONovaOrdemPersonagemModel } from "./actor-model.js";
import { AONOVAORDEM } from "./config.js";
import * as Rolls from "./rolls.js";
import { status, statusSanidade } from "./rolls.js";
import { AONovaOrdemArmaduraModel } from "./item-armadura-model.js";
import { AONovaOrdemArmaduraSheet } from "./item-armadura-sheet.js";
import { AONovaOrdemItemsModel } from "./item-items-model.js";
import { AONovaOrdemItemsSheet } from "./item-items-sheet.js";
import { AONovaOrdemArmaModel } from "./item-arma-model.js";
import { AONovaOrdemArmaSheet } from "./item-arma-sheet.js";
import { AONovaOrdemAlquimicoModel } from "./item-alquimico-model.js";
import { AONovaOrdemAlquimicoSheet } from "./item-alquimico-sheet.js";
import { AONovaOrdemDrogasModel } from "./item-drogas-model.js";
import { AONovaOrdemDrogasSheet } from "./item-drogas-sheet.js";
import { AONovaOrdemMagiasModel } from "./item-magias-model.js";
import { AONovaOrdemMagiasSheet } from "./item-magias-sheet.js";
import { AONovaOrdemRituaisModel } from "./item-rituais-model.js";
import { AONovaOrdemRituaisSheet } from "./item-rituais-sheet.js";
import { AONovaOrdemImplantesModel } from "./item-implantes-model.js";
import { AONovaOrdemImplantesSheet } from "./item-implantes-sheet.js";
import { AONovaOrdemMechaModel } from "./item-mecha-model.js";
import { AONovaOrdemMechaSheet } from "./item-mecha-sheet.js";
import { AONovaOrdemVeiculoModel } from "./item-veiculo-model.js";
import { AONovaOrdemVeiculoSheet } from "./item-veiculo-sheet.js";
import { AONovaOrdemAlquimiaModel } from "./item-alquimia-model.js";
import { AONovaOrdemAlquimiaSheet } from "./item-alquimia-sheet.js";
import { AONovaOrdemAcidoModel } from "./item-acido-model.js";
import { AONovaOrdemAcidoSheet } from "./item-acido-sheet.js";
import { AONovaOrdemVenenoModel } from "./item-veneno-model.js";
import { AONovaOrdemVenenoSheet } from "./item-veneno-sheet.js";
import { AONovaOrdemInjecaoModel } from "./item-injecao-model.js";
import { AONovaOrdemInjecaoSheet } from "./item-injecao-sheet.js";
import { AONovaOrdemElixirModel } from "./item-elixir-model.js";
import { AONovaOrdemElixirSheet } from "./item-elixir-sheet.js";
import { AONovaOrdemMutagenicoModel } from "./item-mutagenico-model.js";
import { AONovaOrdemMutagenicoSheet } from "./item-mutagenico-sheet.js";
import { AONovaOrdemCatalogo } from "./catalogo.js";
import { AONovaOrdemCriador } from "./criador.js";
import { registrarCombate, pedir, atacar, conjurar, config } from "./combate.js";
import { registrarMigracoes } from "./migracao.js";
import "./regras-itens.js";
import { registrarListaPericias } from "./lista-pericias.js";
import { AONovaOrdemNpcModel } from "./npc-model.js";
import { AONovaOrdemNpcSheet } from "./npc-sheet.js";
import { AONovaOrdemPainelMestre } from "./painel-mestre.js";
import { registrarAnimacoes } from "./animacoes.js";
import "./item-piles.js";


Hooks.once("init", () => {
  console.log("A Nova Ordem | Init");

  // CONFIG do sistema
  CONFIG.AONOVAORDEM = AONOVAORDEM;
  
  // DataModel
  CONFIG.Actor.dataModels = {
    personagem: AONovaOrdemPersonagemModel,
    npc: AONovaOrdemNpcModel
  };

  // Sheet
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("a-nova-ordem", AONovaOrdemActorSheet, {
    types: ["personagem"],
    makeDefault: true
  });
  Actors.registerSheet("a-nova-ordem", AONovaOrdemNpcSheet, {
    types: ["npc"],
    makeDefault: true
  });
  
  // Expor funções globalmente Rolagens
  window.rolarPericia = Rolls.rolarPericia;
  window.rolarAtributo = Rolls.rolarAtributo;
  window.rolarDano = Rolls.rolarDano;
  window.rolarAlquimico = Rolls.rolarAlquimico;
  window.tocarAnimacao = Rolls.tocarAnimacao;
  game.aonovaordem = { catalogo: AONovaOrdemCatalogo, criador: AONovaOrdemCriador, atacar, conjurar, painel: AONovaOrdemPainelMestre };
  
  //Carregaar armaduras e items
  CONFIG.Item.dataModels = {
    armadura: AONovaOrdemArmaduraModel,
    items: AONovaOrdemItemsModel,
    arma: AONovaOrdemArmaModel,
    alquimico: AONovaOrdemAlquimicoModel,
    drogas: AONovaOrdemDrogasModel,
    magias: AONovaOrdemMagiasModel,
    rituais: AONovaOrdemRituaisModel,
    implantes: AONovaOrdemImplantesModel,
    mecha: AONovaOrdemMechaModel,
    veiculo: AONovaOrdemVeiculoModel,
    alquimia: AONovaOrdemAlquimiaModel,
    acidos: AONovaOrdemAcidoModel,
    venenos: AONovaOrdemVenenoModel,
    injecoes: AONovaOrdemInjecaoModel,
    elixires: AONovaOrdemElixirModel,
    mutagenicos: AONovaOrdemMutagenicoModel
  };

  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("a-nova-ordem", AONovaOrdemArmaduraSheet, {
    types: ["armadura"],
    makeDefault: true
  });
  Items.registerSheet("a-nova-ordem", AONovaOrdemItemsSheet, {
    types: ["items"],
    makeDefault: true
  });
  Items.registerSheet("a-nova-ordem", AONovaOrdemArmaSheet, {
    types: ["arma"],
    makeDefault: true
  });
  Items.registerSheet("a-nova-ordem", AONovaOrdemAlquimicoSheet, {
    types: ["alquimico"],
    makeDefault: true
  });
  Items.registerSheet("a-nova-ordem", AONovaOrdemDrogasSheet, {
    types: ["drogas"],
    makeDefault: true
  });
  Items.registerSheet("a-nova-ordem", AONovaOrdemMagiasSheet, {
    types: ["magias"],
    makeDefault: true
  });
  Items.registerSheet("a-nova-ordem", AONovaOrdemRituaisSheet, {
    types: ["rituais"],
    makeDefault: true
  });
  Items.registerSheet("a-nova-ordem", AONovaOrdemImplantesSheet, {
    types: ["implantes"],
    makeDefault: true
  });
  Items.registerSheet("a-nova-ordem", AONovaOrdemMechaSheet, {
    types: ["mecha"],
    makeDefault: true
  });
  Items.registerSheet("a-nova-ordem", AONovaOrdemVeiculoSheet, {
    types: ["veiculo"],
    makeDefault: true
  });
  Items.registerSheet("a-nova-ordem", AONovaOrdemAlquimiaSheet, {
    types: ["alquimia"],
    makeDefault: true
  });
  Items.registerSheet("a-nova-ordem", AONovaOrdemAcidoSheet, {
    types: ["acidos"],
    makeDefault: true
  });
  Items.registerSheet("a-nova-ordem", AONovaOrdemVenenoSheet, {
    types: ["venenos"],
    makeDefault: true
  });
  Items.registerSheet("a-nova-ordem", AONovaOrdemInjecaoSheet, {
    types: ["injecoes"],
    makeDefault: true
  });
  Items.registerSheet("a-nova-ordem", AONovaOrdemElixirSheet, {
    types: ["elixires"],
    makeDefault: true
  });
  Items.registerSheet("a-nova-ordem", AONovaOrdemMutagenicoSheet, {
    types: ["mutagenicos"],
    makeDefault: true
  });
  
  // Partial compartilhado dos modificadores nas fichas de item
  const carregar = foundry.applications?.handlebars?.loadTemplates ?? loadTemplates;
  carregar({ "aon-modificadores": "systems/a-nova-ordem/sheets/partials/modificadores.html" });

  /* Configurações do mundo */
  game.settings.register("a-nova-ordem", "catalogoJogadores", {
    name: "Jogadores adicionam itens pelo Catálogo",
    hint: "Se desligado, só o mestre vê o botão de adicionar (os jogadores ainda podem consultar e mostrar no chat).",
    scope: "world", config: true, type: Boolean, default: true
  });
  game.settings.register("a-nova-ordem", "abrirCriador", {
    name: "Abrir o Criador de Personagem para personagens novos",
    hint: "Quando um jogador cria um personagem, o criador abre sozinho.",
    scope: "world", config: true, type: Boolean, default: true
  });
  game.settings.register("a-nova-ordem", "tetoCriacao", {
    name: "Teto de perícia na criação (%)",
    hint: "Valor máximo de uma perícia ao criar o personagem, sem o bônus de atributo. Regra do livro: 50. 0 = sem teto.",
    scope: "world", config: true, type: Number, default: 50
  });

  registrarCombate();
  registrarAnimacoes();
  registrarMigracoes();
  game.settings.register("a-nova-ordem", "painelMestre", {
    scope: "world", config: false, type: Object, default: { experiencia: "novatos", pjs: "" }
  });

  /* Atalho do Catálogo */
  game.keybindings.register("a-nova-ordem", "catalogo", {
    name: "Abrir Catálogo de Itens",
    editable: [{ key: "Space", modifiers: ["Control"] }],
    onDown: () => { AONovaOrdemCatalogo.abrir(); return true; }
  });
  registrarListaPericias();

  console.log("A Nova Ordem | Sistema inicializado");
});


/* =========================
 * QUANTIDADE NAS FICHAS DE ITEM
 * Um campo só para todos os tipos, inserido no cabeçalho da ficha.
 * ========================= */
Hooks.on("renderItemSheet", (app, html) => {
  const el = html instanceof HTMLElement ? html : html[0];
  const cabecalho = el?.querySelector(".sheet-header");
  if (!cabecalho || cabecalho.querySelector(".aon-quantidade")) return;
  const label = document.createElement("label");
  label.className = "aon-quantidade";
  label.title = "Quantidade (o peso é multiplicado por ela)";
  label.innerHTML = `Qtd. <input type="number" name="system.quantidade" min="0" step="1"
    value="${Number(app.item.system.quantidade ?? 1)}" ${app.isEditable ? "" : "disabled"}>`;
  cabecalho.append(label);
});

/* Botão do Catálogo na aba Itens */
Hooks.on("renderItemDirectory", (app, html) => {
  const el = html instanceof HTMLElement ? html : html[0];
  const acoes = el?.querySelector(".header-actions");
  if (!acoes || acoes.querySelector(".aon-abrir-catalogo")) return;
  const botao = document.createElement("button");
  botao.type = "button";
  botao.className = "aon-abrir-catalogo";
  botao.innerHTML = `<i class="fas fa-magnifying-glass"></i> Catálogo`;
  botao.addEventListener("click", () => AONovaOrdemCatalogo.abrir());
  acoes.append(botao);
});

/* =========================
 * SANIDADE NO CHAT
 * Toda alteração de Sanidade anuncia o estado mental atual,
 * sem revelar o valor. Só o usuário que fez a alteração envia.
 * ========================= */
Hooks.on("preUpdateActor", (actor, changes, options) => {
  if (foundry.utils.hasProperty(changes, "system.sanidade")) {
    options.aonSanidadeAnterior = Number(actor.system.sanidade ?? 0);
  }
});

Hooks.on("updateActor", (actor, changes, options, userId) => {
  if (userId !== game.user.id) return;
  if (!foundry.utils.hasProperty(changes, "system.sanidade")) return;

  const nova = Number(actor.system.sanidade ?? 0);
  const anterior = options.aonSanidadeAnterior;
  if (anterior === nova) return;

  const [estado, efeito] = statusSanidade(nova);
  const perdeu = anterior === undefined || nova < anterior;
  const cor = perdeu ? "#8a2be2" : "#4682b4";

  ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor }),
    flavor: `
      <div class="chat-card">
        <div style="align-items:center;">
          <img src="${actor.img}" width="40" height="40" style="border:0; border-radius:4px;margin: 10px 0 10px 40%"></img>
          <div style="background-color:#363636; border-radius:10px;color:#e0d8b0">
            A mente de <b>${actor.name}</b> ${perdeu ? "foi abalada." : "se estabilizou."}
          </div>
        </div>
        <hr style="background-color:${cor}">
        <b>Estado Mental:</b> ${estado}<br>
        <i>${efeito}</i>
      </div>
    `
  });
});

/* =========================
 * DURAÇÃO DOS CONSUMÍVEIS
 * RD, peso, essência e atributos são calculados no modelo do
 * personagem (actor-model.js) — não é preciso somar/subtrair aqui.
 * A duração conta nos turnos do próprio personagem: cada vez que o
 * turno volta para ele, os consumíveis ativos perdem 1 turno e se
 * desligam ao chegar a 0.
 * ========================= */

// Ao ativar um consumível, reinicia a contagem de turnos
Hooks.on("preUpdateItem", (item, changes) => {
  const ativo = foundry.utils.getProperty(changes, "system.ativo");
  if (ativo === true && !item.system.ativo) {
    // Tomar um consumível gasta uma unidade
    const cfg = config();
    if (item.parent?.documentName === "Actor" && cfg.ativo && cfg.consumirItens) {
      const qtd = Number(item.system.quantidade ?? 1);
      if (qtd < 1) {
        ui.notifications.warn(`${item.parent.name} não tem mais ${item.name}.`);
        item.parent.sheet?.render(false);
        return false;
      }
      foundry.utils.setProperty(changes, "system.quantidade", qtd - 1);
    }
    foundry.utils.setProperty(changes, "system.restante", Number(item.system.duracao ?? 0));
  }
});

Hooks.on("updateCombat", async (combat, changed, options) => {
  if (!game.user.isGM) return;
  if (!("turn" in changed || "round" in changed)) return;
  if ((options?.direction ?? 1) < 0) return;                 // voltar turno não consome
  if (combat.round <= 1 && combat.turn === 0 && "round" in changed) return; // início do combate

  // Só o personagem cujo turno começou agora
  const actor = combat.combatant?.actor;
  if (actor) {
    const updates = [];
    const encerrados = [];
    for (const item of actor.items) {
      const s = item.system;
      if (!s?.ativo || !(s.duracao > 0)) continue;
      const restante = Math.max(0, Number(s.restante ?? 0) - 1);
      if (restante === 0) {
        updates.push({ _id: item.id, "system.ativo": false, "system.restante": 0 });
        encerrados.push(item.name);
      } else {
        updates.push({ _id: item.id, "system.restante": restante });
      }
    }
    if (updates.length) await actor.updateEmbeddedDocuments("Item", updates);
    if (encerrados.length) {
      ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor }),
        content: `<b>Efeito encerrado:</b> ${encerrados.join(", ")}`
      });
    }
  }
});

/* Botões − / + dos cartões de dano: token selecionado ou, sem seleção, o alvo marcado.
 * Se o jogador não for dono do alvo, o mestre aplica (combate.js). */
Hooks.on("renderChatMessageHTML", (message, html) => {
  const alvoDoBotao = () => canvas.tokens.controlled[0]?.actor ?? [...game.user.targets][0]?.actor;
  for (const botao of html.querySelectorAll(".aplicar-dano, .aplicar-cura")) {
    botao.addEventListener("click", ev => {
      ev.preventDefault();
      const cura = botao.classList.contains("aplicar-cura");
      const valor = Number(cura ? botao.dataset.cura : botao.dataset.dano);
      if (isNaN(valor)) return ui.notifications.warn("Valor inválido.");
      const actor = alvoDoBotao();
      if (!actor) return ui.notifications.warn("Selecione ou marque um token.");
      if (cura) pedir("cura", { uuid: actor.uuid, cura: valor });
      else pedir("dano", { uuid: actor.uuid, dano: valor, bruto: true, alquimico: botao.dataset.alquimico || false });
    });
  }
});
