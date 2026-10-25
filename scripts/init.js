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


Hooks.once("init", () => {
  console.log("A Nova Ordem | Init");

  // CONFIG do sistema
  CONFIG.AONOVAORDEM = AONOVAORDEM;
  
  // DataModel
  CONFIG.Actor.dataModels = {
    personagem: AONovaOrdemPersonagemModel
  };

  // Sheet
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("a-nova-ordem", AONovaOrdemActorSheet, {
    types: ["personagem"],
    makeDefault: true
  });
  
  // Expor funções globalmente Rolagens
  window.rolarPericia = Rolls.rolarPericia;
  window.rolarAtributo = Rolls.rolarAtributo;
  window.rolarDano = Rolls.rolarDano;
  window.rolarAlquimico = Rolls.rolarAlquimico;
  
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

  console.log("A Nova Ordem | Sistema inicializado");
});


/* =========================
 * DURAÇÃO DOS CONSUMÍVEIS
 * RD, peso, essência e atributos agora são calculados no modelo do
 * personagem (actor-model.js) — não é mais preciso somar/subtrair aqui.
 * A cada nova rodada de combate, consumíveis ativos com duração
 * perdem 1 rodada e se desligam ao chegar a 0.
 * ========================= */
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

// Ao ativar um consumível, reinicia a contagem de rodadas
Hooks.on("preUpdateItem", (item, changes) => {
  const ativo = foundry.utils.getProperty(changes, "system.ativo");
  if (ativo === true && !item.system.ativo) {
    foundry.utils.setProperty(changes, "system.restante", Number(item.system.duracao ?? 0));
  }
});

Hooks.on("updateCombat", async (combat, changed, options) => {
  if (!game.user.isGM) return;
  // Rodada 1 = início do combate: não consome duração
  if (!("round" in changed) || changed.round <= 1 || (options?.direction ?? 1) < 0) return;

  for (const combatant of combat.combatants) {
    const actor = combatant.actor;
    if (!actor) continue;

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

Hooks.on("renderChatMessage", (message, html, data) => {

  html.find(".aplicar-dano").on("click", async ev => {
    ev.preventDefault();

    const dano = Number(ev.currentTarget.dataset.dano);
    if (isNaN(dano)) return ui.notifications.warn("Dano inválido.");
    
    // Token selecionado?
    const token = canvas.tokens.controlled[0];
    if (!token) {
      return ui.notifications.warn("Selecione um token.");
    }

    const actor = token.actor;
    if (!actor) return;

    const rd = actor.system.rd ?? 0;
    const danoEfetivo = Math.max(0, dano - rd);
    const saudeAtual = Number(actor.system.saude ?? 0);
    const saudeNova = Math.max(0, saudeAtual - danoEfetivo);

    let resutado = status(saudeNova);

    await actor.update({
      "system.saude": saudeNova,
      "system.penalidades.penfisica":        Number(resutado[1] ?? 0),
      "system.penalidades.pensociais":       Number(resutado[1] ?? 0),
      "system.penalidades.penmentais":       Number(resutado[1] ?? 0),
      "system.penalidades.pentecnicologica": Number(resutado[1] ?? 0),
      "system.penalidades.penaquimica":      Number(resutado[1] ?? 0),
      "system.penalidades.penmagica":        Number(resutado[1] ?? 0),
      "system.penalidades.pensobrevivencia": Number(resutado[1] ?? 0)
    });

    
    ui.notifications.info(
      `${actor.name} sofreu ${dano} de dano à Saúde.<br><br><b>Status:</b> ${resutado[0]}`
    );
    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: actor.name }),
      flavor: `
        <div class="chat-card">
          <div style="align-items:center;">
            <img src="${actor.img}" width="40" height="40" style="border:0; border-radius:4px;margin: 10px 0 10px 40%"></img>
            <div style="background-color:#363636; border-radius:10px;color:#e0d8b0">
              Reduziu <b style="color:red">${danoEfetivo}</b> na sua Saúde.
            </div>
          </div>
          <hr style="background-color:red">
          <b>Status:</b> ${resutado[0]}
        </div>
        
      `
    });
  });
  html.find(".aplicar-cura").on("click", async ev => {
    ev.preventDefault();

    const dano = Number(ev.currentTarget.dataset.cura);
    if (isNaN(dano)) return ui.notifications.warn("Cura inválido.");

    // Token selecionado?
    const token = canvas.tokens.controlled[0];
    if (!token) {
      return ui.notifications.warn("Selecione um token.");
    }

    const actor = token.actor;
    if (!actor) return;

    const saudeAtual = Number(actor.system.saude ?? 0);
    const saudeNova = Math.min(100, saudeAtual + dano);
    let resutado = status(saudeNova);
    await actor.update({
      "system.saude": saudeNova,
      "system.penalidades.penfisica":        Number(resutado[1] ?? 0),
      "system.penalidades.pensociais":       Number(resutado[1] ?? 0),
      "system.penalidades.penmentais":       Number(resutado[1] ?? 0),
      "system.penalidades.pentecnicologica": Number(resutado[1] ?? 0),
      "system.penalidades.penaquimica":      Number(resutado[1] ?? 0),
      "system.penalidades.penmagica":        Number(resutado[1] ?? 0),
      "system.penalidades.pensobrevivencia": Number(resutado[1] ?? 0)
    });

    ui.notifications.info(
      `<b>${actor.name}</b> Curou ${dano} na sua Saúde.<br><br><b>Status:</b> ${resutado[0]}`
    );
    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor }),
      flavor: `
        <div class="chat-card">
          <div style="align-items:center;">
            <img src="${actor.img}" width="40" height="40" style="border:0; border-radius:4px;margin: 10px 0 10px 40%"></img>
            <div style="background-color:#363636; border-radius:10px;color:#e0d8b0">
              Curou <b style="color:Chartreuse">${dano}</b> na sua Saúde.
            </div>
          </div>
          <hr style="background-color:green">
          <b>Status:</b> ${resutado[0]}
        </div>
      `
    });

    // ChatMessage.create({
    //   speaker: ChatMessage.getSpeaker({ actor: actor.name }),
    //   flavor: `
    //         <img src="${actor.img}" width="40" height="40" style="border:0; border-radius:4px;margin-left:40%"></img>
    //     <b>${actor.name}</b> Curou ${dano} na sua Saúde.<br><br><b>Status:</b> ${resutado[0]}
        
    //   `
    // });
    
  });

});






