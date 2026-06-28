import { AONovaOrdemActorSheet } from "./sheet.js";
import { AONovaOrdemPersonagemModel } from "./actor-model.js";
import { AONOVAORDEM } from "./config.js";
import * as Rolls from "./rolls.js";
import { status } from "./rolls.js";
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
    acido: AONovaOrdemAcidoModel,
    veneno: AONovaOrdemVenenoModel,
    injecao: AONovaOrdemInjecaoModel,
    elixir: AONovaOrdemElixirModel,
    mutagenico: AONovaOrdemMutagenicoModel
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
  
  console.log("A Nova Ordem | Sistema inicializado");
});


Hooks.on("createItem", async (item, options, userId) => {

  console.log("HOOK createItem disparou:", item.name, item.type);
  if (!item.parent) return;              // não está em um actor
  if (item.type == "armadura"){
    const actor = item.parent;
    const armadura = item.system;
    // console.log(actor.system.rd,armadura.rd,actor.system.atributos.con)
    await actor.update({
      "system.rd": actor.system.atributos.con + armadura.rd,
      "system.pesoUnit": actor.system.pesoUnit + armadura.peso
    });
  }
  if (item.type == "items"){
    const actor = item.parent;
    const items = item.system;
    await actor.update({
      "system.pesoUnit": actor.system.pesoUnit + (items.peso ?? 0)
    });
  }
  if (item.type == "arma"){
    const actor = item.parent;
    const arma = item.system;
    await actor.update({
      "system.pesoUnit": actor.system.pesoUnit + (arma.peso ?? 0)
    });
  }
  
  return;
  
});

Hooks.on("deleteItem", async (item, options, userId) => {
  console.log("HOOK deleteItem disparou:", item.name, item.type);
  if (!item.parent) return;
  if (item.type == "armadura"){
    const actor = item.parent;
    const armadura = item.system;
    // console.log(actor.system.rd,armadura.rd,actor.system.atributos.con)
    await actor.update({
      "system.rd": Math.max(0, (actor.system.rd - armadura.rd)),
      "system.pesoUnit": actor.system.pesoUnit - armadura.peso
    });
  }
  if (item.type == "items"){
    const actor = item.parent;
    const items = item.system;
    await actor.update({
      "system.pesoUnit": Math.max(0, actor.system.pesoUnit - (items.peso ?? 0))
    });
  }
  if (item.type == "arma"){
    const actor = item.parent;
    const arma = item.system;
    await actor.update({
      "system.pesoUnit": Math.max(0, actor.system.pesoUnit - (arma.peso ?? 0))
    });
  }
  return;

  
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

    const saudeAtual = Number(actor.system.saude ?? 0);
    const saudeNova = Math.max(0, saudeAtual - dano);

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
              Reduziu <b style="color:red">${dano}</b> na sua Saúde.
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






