
export class AONovaOrdemActorSheet extends foundry.appv1.sheets.ActorSheet {

  static get defaultOptions() {
    console.log("AONovaOrdem | defaultOptions chamado");
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["a-nova-ordem", "sheet", "actor"],
      template: "systems/a-nova-ordem/sheets/actor-sheet.html",
      width: 700,
      height: 700
    });
  }

  getData() {
    console.log("AONovaOrdem | getData chamado");
    const context = super.getData();
    const system = this.actor.system;

    function montarPericia(key, config, system) {
      const data = system.pericias?.[key] ?? { valor: 0, bonus: 0 };
      
      return {
        key,
        label: config.label,
        base: Number(config.base ?? 0),
        valor: Number(data.valor ?? 0),
        bonus: Number(data.bonus ?? 0),
        total:
          Number(config.base ?? 0) +
          Number(data.valor ?? 0) +
          Number(data.bonus ?? 0)
      };
    }

    /* ATRIBUTOS */
    context.atributos = Object.entries(system.atributos).map(
      ([key, valor]) => ({
        key,
        valor,
        label: CONFIG.AONOVAORDEM.atributos[key]?.label ?? key.toUpperCase()
      })
    );
    /* PPENALIDADES */
    context.penalidades = Object.entries(system.penalidades).map(
      ([key, valor]) => ({
        key,
        valor,
        label: CONFIG.AONOVAORDEM.penalidades[key]?.label ?? key
      })
    );
    
    
    /* PERÍCIAS AGRUPADAS */
    const grupos = {};

    for (const [key, config] of Object.entries(CONFIG.AONOVAORDEM.pericias)) {
      const grupo = config.grupo ?? "OUTROS";
      if (!grupos[grupo]) grupos[grupo] = [];

      grupos[grupo].push(
        montarPericia(key, config, system)
      );
    }

    // 🔤 ORDENAÇÃO ALFABÉTICA DENTRO DE CADA GRUPO (ENTRA AQUI)
    for (const grupo of Object.keys(grupos)) {
      grupos[grupo].sort((a, b) =>
        a.label.localeCompare(b.label, "pt-BR")
      );
    }

    context.periciasPorGrupo = grupos;
    
    /* ARMADURAS */
    context.armaduras = this.actor.items
      .filter(i => i.type === "armadura")
      .map(i => ({
        id: i.id,
        nome: i.name,
        tipo: i.system.tipo,
        rd: i.system.rd,
        peso: i.system.peso,
        penalidades: i.system.penalidades
      }));

    context.system = system;
 
    /* Items */
    context.items = this.actor.items
      .filter(i => i.type === "items")
      .map(i => ({
        id: i.id,
        nome: i.name,
        tipo: i.system.tipo,
        uso: i.system.uso,
        peso: i.system.peso,
        efeito: i.system.efeito
      }));

    context.system = system;

    /* Armas */
    context.arma = this.actor.items
      .filter(i => i.type === "arma")
      .map(i => ({
        id: i.id,
        nome: i.name,
        tipo: i.system.tipo,
        ammo: i.system.ammo,
        vt: i.system.vt,
        peso: i.system.peso,
        dano: i.system.dano
      }));

    context.system = system;

    /* Alquimico */
    context.alquimico = this.actor.items
      .filter(i => i.type === "alquimico")
      .map(i => ({
        id: i.id,
        nome: i.name,
        nivel: i.system.nivel,
        tecnica: i.system.tecnica,
        tipo: i.system.tipo,
        alvo: i.system.alvo,
        dano: i.system.dano,
        efeito: i.system.efeito
      }));
    
    /* drogas */
    context.drogas = this.actor.items
      .filter(i => i.type === "drogas")
      .map(i => ({
        id: i.id,
        nome: i.name,
        tipo: i.system.tipo,
        efeito: i.system.efeito,
        colateral: i.system.colateral
      }));

    context.system = system;

    /* Implantes  */
    context.implantes = this.actor.items
      .filter(i => i.type === "implantes")
      .map(i => ({
        id: i.id,
        nome: i.name,
        efeito: i.system.efeito,
        essencia: i.system.essencia,
        conceito: i.system.conceito,
        preco: i.system.preco
      }));

    context.system = system;

    /* MAgias */
    context.magias = this.actor.items
      .filter(i => i.type === "magias")
      .map(i => ({
        id: i.id,
        nome: i.name,
        conceito: i.system.conceito,
        essencia: i.system.essencia,
        dano: i.system.dano,
        efeito: i.system.efeito,
        circulo: i.system.circulo
      }));

    context.system = system;

    /* Mecha */
    context.mecha = this.actor.items
      .filter(i => i.type === "mecha")
      .map(i => ({
        id: i.id,
        nome: i.name,
        tipo: i.system.tipo,
        est: i.system.est,
        bld: i.system.bld,
        mob: i.system.mob,
        pre: i.system.pre,
        pot: i.system.pot,
        preco: i.system.preco
      }));

    context.system = system;

    /* Rituais */
    context.rituais = this.actor.items
      .filter(i => i.type === "rituais")
      .map(i => ({
        id: i.id,
        nome: i.name,
        conceito: i.system.conceito,
        essencia: i.system.essencia,
        tempo: i.system.tempo,
        efeito: i.system.efeito
      }));

    context.system = system;

    /* Veiculo */
    context.veiculo = this.actor.items
      .filter(i => i.type === "veiculo")
      .map(i => ({
        id: i.id,
        nome: i.name,
        ex: i.system.ex,
        vel: i.system.vel,
        est: i.system.est,
        bld: i.system.bld,
        pot: i.system.pot,
        preco: i.system.preco
      }));

    context.system = system;

    /* Veiculo */
    context.alquimia = this.actor.items
      .filter(i => i.type === "alquimia")
      .map(i => ({
        id: i.id,
        nome: i.name,
        efeito: i.system.efeito,
        conceito: i.system.conceito,
        tempo: i.system.tempo,
        preco: i.system.preco
      }));

    context.system = system;

    /* Veiculo */
    context.acidos = this.actor.items
      .filter(i => i.type === "acidos")
      .map(i => ({
        id: i.id,
        nome: i.name,
        tipo: i.system.tipo,
        efeito: i.system.efeito,
        conceito: i.system.conceito,
        preco: i.system.preco
      }));

    context.system = system;

    /* Veiculo */
    context.venenos = this.actor.items
      .filter(i => i.type === "venenos")
      .map(i => ({
        id: i.id,
        nome: i.name,
        tipo: i.system.tipo,
        efeito: i.system.efeito,
        conceito: i.system.conceito,
        preco: i.system.preco
      }));

    context.system = system;

    /* Veiculo */
    context.injecoes = this.actor.items
      .filter(i => i.type === "injecoes")
      .map(i => ({
        id: i.id,
        nome: i.name,
        efeito: i.system.efeito,
        colateral: i.system.colateral,
        conceito: i.system.conceito,
        preco: i.system.preco
      }));

    context.system = system;

    /* Veiculo */
    context.elixires = this.actor.items
      .filter(i => i.type === "elixires")
      .map(i => ({
        id: i.id,
        nome: i.name,
        efeito: i.system.efeito,
        colateral: i.system.colateral,
        conceito: i.system.conceito,
        preco: i.system.preco
      }));

    context.system = system;

    /* Veiculo */
    context.mutagenicos = this.actor.items
      .filter(i => i.type === "mutagenicos")
      .map(i => ({
        id: i.id,
        nome: i.name,
        efeito: i.system.efeito,
        mutacao: i.system.mutacao,
        conceito: i.system.conceito,
        preco: i.system.preco
      }));

    context.system = system;



    return context;
  }
  



  activateListeners(html) {
    super.activateListeners(html);

    html.find(".rolar-atributo").on("click", ev => {
      const atributo = ev.currentTarget.dataset.atributo;
      window.rolarAtributo(this.actor, atributo);
    });
    html.find(".ammo-input").on("change", ev => {
      const input = ev.currentTarget;
      const itemId = input.dataset.itemId;
      const value = Math.max(0,Number(input.value));

      const item = this.actor.items.get(itemId);
      item.update({ "system.ammo": value });
    });

    html.find(".rolar-pericia").on("click", ev => {
      const pericia = ev.currentTarget.dataset.pericia;
      window.rolarPericia(this.actor, pericia);
    });

    html.find(".rolar-dano").on("click", ev => {
      ev.preventDefault();

      const tr = ev.currentTarget.closest("tr");
      if (!tr) return;

      const itemId = tr.dataset.itemId;
      if (!itemId) return;

      const item = this.actor.items.get(itemId);
      if (!item) return;

      const municao = item.system.ammo;
      if (municao < 1) {
        ui.notifications.warn("Sem munição na arma.");
        return;
      }

      const danoTexto = item.system.dano; 
      // Ex: "2d6 + FOR / perfurante"

      const resultado = prepararDano(danoTexto, this.actor);

      if (!resultado) {
        ui.notifications.warn("Dano inválido na arma.");
        return;
      }

      window.rolarDano({
        actor: this.actor,
        itemName: item.name,
        formula: resultado.formula,
        atributo: resultado.atributo,
        atributoValor: resultado.atributoValor,
        textoOriginal: danoTexto
      });
    });
    function prepararDano(texto, actor) {
      if (!texto) return null;

      // Divide pelo "/"
      const [partePrincipal] = texto.split("/");

      /// 1️⃣ Sempre tenta pegar XdY
      const formulaMatch = partePrincipal.match(/(\d+d\d+)/i);
      if (!formulaMatch) return null;

      const formulaBase = formulaMatch[1]; // ex: 2d6 ou 4d6

      // 2️⃣ Tenta pegar "+ ATR" (opcional)
      const atributoMatch = partePrincipal.match(/\+\s*(\w+)/i);

      let atributoKey = "";
      let atributoValor = "";

      if (atributoMatch) {
        atributoKey = atributoMatch[1].toLowerCase();
        atributoValor = Number(actor.system.atributos[atributoKey] ?? 0);
      }

      return {
        formula: formulaBase,
        atributo: atributoKey,
        atributoValor
      };
    }
    html.find(".rolar-alquimico").on("click", ev => {
      ev.preventDefault();

      const tr = ev.currentTarget.closest("tr");
      if (!tr) return;

      const itemId = tr.dataset.itemId;
      if (!itemId) return;

      const item = this.actor.items.get(itemId);
      if (!item) return;

      const al = item.system;

      window.rolarAlquimico({
        actor: this.actor,
        alquimico: al
      });
    });
    //REMOVER ITEMS EM GERAL ************************************
    html.find(".remover-alquimico").on("click", ev => {
      ev.preventDefault();

      const tr = ev.currentTarget.closest("tr");
      if (!tr) return;

      const itemId = tr.dataset.itemId;
      if (!itemId) return;

      new Dialog({
        title: "Remover Alquimico",
        content: "<p>Tem certeza que deseja remover esta alquimico?</p>",
        buttons: {
          sim: {
            label: "Sim",
            callback: () => {
              this.actor.deleteEmbeddedDocuments("Item", [itemId]);
            }
          },
          nao: {
            label: "Não"
          }
        }
      }).render(true);
    });   

    html.find(".remover-armadura").on("click", ev => {
      ev.preventDefault();

      const tr = ev.currentTarget.closest("tr");
      if (!tr) return;

      const itemId = tr.dataset.itemId;
      if (!itemId) return;

      new Dialog({
        title: "Remover Armadura",
        content: "<p>Tem certeza que deseja remover esta armadura?</p>",
        buttons: {
          sim: {
            label: "Sim",
            callback: () => {
              this.actor.deleteEmbeddedDocuments("Item", [itemId]);
            }
          },
          nao: {
            label: "Não"
          }
        }
      }).render(true);
    });

    html.find(".remover-item").on("click", ev => {
      ev.preventDefault();

      const tr = ev.currentTarget.closest("tr");
      if (!tr) return;

      const itemId = tr.dataset.itemId;
      if (!itemId) return;

      new Dialog({
        title: "Remover Item",
        content: "<p>Tem certeza que deseja remover este item?</p>",
        buttons: {
          sim: {
            label: "Sim",
            callback: () => {
              this.actor.deleteEmbeddedDocuments("Item", [itemId]);
              
            }
          },
          nao: {
            label: "Não"
          }
        }
      }).render(true);
    });
    html.find(".remover-arma").on("click", ev => {
      ev.preventDefault();

      const tr = ev.currentTarget.closest("tr");
      if (!tr) return;

      const itemId = tr.dataset.itemId;
      if (!itemId) return;

      new Dialog({
        title: "Remover Arma",
        content: "<p>Tem certeza que deseja remover esta arma?</p>",
        buttons: {
          sim: {
            label: "Sim",
            callback: () => {
              this.actor.deleteEmbeddedDocuments("Item", [itemId]);
              
            }
          },
          nao: {
            label: "Não"
          }
        }
      }).render(true);
    });
    html.find(".remover-drogas").on("click", ev => {
      ev.preventDefault();

      const tr = ev.currentTarget.closest("tr");
      if (!tr) return;

      const itemId = tr.dataset.itemId;
      if (!itemId) return;

      new Dialog({
        title: "Remover Drogas",
        content: "<p>Tem certeza que deseja remover esta droga?</p>",
        buttons: {
          sim: {
            label: "Sim",
            callback: () => {
              this.actor.deleteEmbeddedDocuments("Item", [itemId]);
              
            }
          },
          nao: {
            label: "Não"
          }
        }
      }).render(true);
    });
    html.find(".remover-implantes").on("click", ev => {
      ev.preventDefault();

      const tr = ev.currentTarget.closest("tr");
      if (!tr) return;

      const itemId = tr.dataset.itemId;
      if (!itemId) return;

      new Dialog({
        title: "Remover Implantes",
        content: "<p>Tem certeza que deseja remover esta implante?</p>",
        buttons: {
          sim: {
            label: "Sim",
            callback: () => {
              this.actor.deleteEmbeddedDocuments("Item", [itemId]);
              
            }
          },
          nao: {
            label: "Não"
          }
        }
      }).render(true);
    });
    html.find(".remover-magias").on("click", ev => {
      ev.preventDefault();

      const tr = ev.currentTarget.closest("tr");
      if (!tr) return;

      const itemId = tr.dataset.itemId;
      if (!itemId) return;

      new Dialog({
        title: "Remover Magias",
        content: "<p>Tem certeza que deseja remover esta magia?</p>",
        buttons: {
          sim: {
            label: "Sim",
            callback: () => {
              this.actor.deleteEmbeddedDocuments("Item", [itemId]);
              
            }
          },
          nao: {
            label: "Não"
          }
        }
      }).render(true);
    });
    html.find(".remover-rituais").on("click", ev => {
      ev.preventDefault();

      const tr = ev.currentTarget.closest("tr");
      if (!tr) return;

      const itemId = tr.dataset.itemId;
      if (!itemId) return;

      new Dialog({
        title: "Remover Rituais",
        content: "<p>Tem certeza que deseja remover esta ritual?</p>",
        buttons: {
          sim: {
            label: "Sim",
            callback: () => {
              this.actor.deleteEmbeddedDocuments("Item", [itemId]);
              
            }
          },
          nao: {
            label: "Não"
          }
        }
      }).render(true);
    });
    html.find(".remover-veiculo").on("click", ev => {
      ev.preventDefault();

      const tr = ev.currentTarget.closest("tr");
      if (!tr) return;

      const itemId = tr.dataset.itemId;
      if (!itemId) return;

      new Dialog({
        title: "Remover Veículo",
        content: "<p>Tem certeza que deseja remover esta veículo?</p>",
        buttons: {
          sim: {
            label: "Sim",
            callback: () => {
              this.actor.deleteEmbeddedDocuments("Item", [itemId]);
              
            }
          },
          nao: {
            label: "Não"
          }
        }
      }).render(true);
    });
    html.find(".remover-mecha").on("click", ev => {
      ev.preventDefault();

      const tr = ev.currentTarget.closest("tr");
      if (!tr) return;

      const itemId = tr.dataset.itemId;
      if (!itemId) return;

      new Dialog({
        title: "Remover Mechas",
        content: "<p>Tem certeza que deseja remover esta mecha?</p>",
        buttons: {
          sim: {
            label: "Sim",
            callback: () => {
              this.actor.deleteEmbeddedDocuments("Item", [itemId]);
              
            }
          },
          nao: {
            label: "Não"
          }
        }
      }).render(true);
    });
    html.find(".remover-alquimia").on("click", ev => {
      ev.preventDefault();

      const tr = ev.currentTarget.closest("tr");
      if (!tr) return;

      const itemId = tr.dataset.itemId;
      if (!itemId) return;

      new Dialog({
        title: "Remover Alquimia",
        content: "<p>Tem certeza que deseja remover esta alquimia?</p>",
        buttons: {
          sim: {
            label: "Sim",
            callback: () => {
              this.actor.deleteEmbeddedDocuments("Item", [itemId]);
              
            }
          },
          nao: {
            label: "Não"
          }
        }
      }).render(true);
    });
    html.find(".remover-acido").on("click", ev => {
      ev.preventDefault();

      const tr = ev.currentTarget.closest("tr");
      if (!tr) return;

      const itemId = tr.dataset.itemId;
      if (!itemId) return;

      new Dialog({
        title: "Remover Ácido",
        content: "<p>Tem certeza que deseja remover este ácido?</p>",
        buttons: {
          sim: {
            label: "Sim",
            callback: () => {
              this.actor.deleteEmbeddedDocuments("Item", [itemId]);
              
            }
          },
          nao: {
            label: "Não"
          }
        }
      }).render(true);
    });
    html.find(".remover-veneno").on("click", ev => {
      ev.preventDefault();

      const tr = ev.currentTarget.closest("tr");
      if (!tr) return;

      const itemId = tr.dataset.itemId;
      if (!itemId) return;

      new Dialog({
        title: "Remover Veneno",
        content: "<p>Tem certeza que deseja remover este veneno?</p>",
        buttons: {
          sim: {
            label: "Sim",
            callback: () => {
              this.actor.deleteEmbeddedDocuments("Item", [itemId]);
              
            }
          },
          nao: {
            label: "Não"
          }
        }
      }).render(true);
    });
    html.find(".remover-injecao").on("click", ev => {
      ev.preventDefault();

      const tr = ev.currentTarget.closest("tr");
      if (!tr) return;

      const itemId = tr.dataset.itemId;
      if (!itemId) return;

      new Dialog({
        title: "Remover Injeção",
        content: "<p>Tem certeza que deseja remover esta injeção?</p>",
        buttons: {
          sim: {
            label: "Sim",
            callback: () => {
              this.actor.deleteEmbeddedDocuments("Item", [itemId]);
              
            }
          },
          nao: {
            label: "Não"
          }
        }
      }).render(true);
    });
    html.find(".remover-elixir").on("click", ev => {
      ev.preventDefault();

      const tr = ev.currentTarget.closest("tr");
      if (!tr) return;

      const itemId = tr.dataset.itemId;
      if (!itemId) return;

      new Dialog({
        title: "Remover Elixir",
        content: "<p>Tem certeza que deseja remover este elixir?</p>",
        buttons: {
          sim: {
            label: "Sim",
            callback: () => {
              this.actor.deleteEmbeddedDocuments("Item", [itemId]);
              
            }
          },
          nao: {
            label: "Não"
          }
        }
      }).render(true);
    });
    html.find(".remover-mutagenico").on("click", ev => {
      ev.preventDefault();

      const tr = ev.currentTarget.closest("tr");
      if (!tr) return;

      const itemId = tr.dataset.itemId;
      if (!itemId) return;

      new Dialog({
        title: "Remover Mutagênico",
        content: "<p>Tem certeza que deseja remover este mutagenico?</p>",
        buttons: {
          sim: {
            label: "Sim",
            callback: () => {
              this.actor.deleteEmbeddedDocuments("Item", [itemId]);
              
            }
          },
          nao: {
            label: "Não"
          }
        }
      }).render(true);
    });

    //MOSTRAR ITEM EM GERAL Chama a função mostrar chaat ***************************
    html.find(".mostrar-item").on("click", this._onMostrarItem.bind(this));
    html.find(".mostrar-armadura").on("click", this._onMostrarArmadura.bind(this));
    html.find(".mostrar-arma").on("click", this._onMostrarArma.bind(this));
    html.find(".mostrar-alquimico").on("click", this._onMostrarAlquimico.bind(this));
    html.find(".mostrar-drogas").on("click", this._onMostrarDroga.bind(this));
    html.find(".mostrar-implantes").on("click", this._onMostrarImplante.bind(this));
    html.find(".mostrar-magias").on("click", this._onMostrarMagia.bind(this));
    html.find(".mostrar-rituais").on("click", this._onMostrarRitual.bind(this));
    html.find(".mostrar-veiculo").on("click", this._onMostrarVeiculo.bind(this));
    html.find(".mostrar-mecha").on("click", this._onMostrarMecha.bind(this));
    html.find(".mostrar-alquimia").on("click", this._onMostrarAlquimia.bind(this));
    html.find(".mostrar-acido").on("click", this._onMostrarAcido.bind(this));
    html.find(".mostrar-veneno").on("click", this._onMostrarVeneno.bind(this));
    html.find(".mostrar-injecao").on("click", this._onMostrarInjecao.bind(this));
    html.find(".mostrar-elixir").on("click", this._onMostrarElixir.bind(this));
    html.find(".mostrar-mutagenico").on("click", this._onMostrarMutagenico.bind(this));
    

  }
  //Mostrar no chat
  async _onMostrarItem(event) {
    event.preventDefault();

    const itemId = event.currentTarget.dataset.itemId;
    if (!itemId) return;

    const item = this.actor.items.get(itemId);
    if (!item) return;

    const s = item.system;
  
    let content = `
    <div class="chat-item">
      <h2>${item.name}</h2>      
      <img src='${item.img}'>
      <ul>
        <li><b>Tipo:</b> ${s.tipo ?? "-"}</li>
        <li><b>Uso:</b> ${s.uso ?? "-"}</li>
        <li><b>Peso:</b> ${s.peso ?? 0}</li>
        <li><b>Efeito:</b> ${s.efeito ?? "-"}</li>
        <li><b>Conceito:</b> ${s.conceito ?? "-"}</li>
      </ul>
    </div>
    `;
    //<li><b>Preço:</b> ${s.preco ?? "-"}</li>
    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content
    });
  }
  async _onMostrarArmadura(event) {
    event.preventDefault();

    const itemId = event.currentTarget.dataset.itemId;
    if (!itemId) return;

    const item = this.actor.items.get(itemId);
    if (!item) return;

    const s = item.system;
  
    let content = `
    <div class="chat-item">
      <h2>${item.name}</h2>      
      <img src='${item.img}'>
      <ul>
        <li><b>Tipo:</b> ${s.tipo ?? "-"}</li>
        <li><b>RD:</b> ${s.rd ?? 0}</li>
        <li><b>Peso:</b> ${s.peso ?? 0}</li>
        <li><b>Efeito:</b> ${s.penalidades ?? "-"}</li>
        <li><b>Conceito:</b> ${s.conceito ?? "-"}</li>
        
      </ul>
    </div>
    `;
    //<li><b>Preço:</b> ${s.preco ?? "-"}</li>
    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content
    });
  }
  async _onMostrarArma(event) {
    event.preventDefault();

    const itemId = event.currentTarget.dataset.itemId;
    if (!itemId) return;

    const item = this.actor.items.get(itemId);
    if (!item) return;

    const s = item.system;
  
    let content = `
    <div class="chat-item">
      <h2>${item.name}</h2>      
      <img src='${item.img}'>
      <ul>
        <li><b>Tipo:</b> ${s.tipo ?? "-"}</li>
        <li><b>Uso:</b> ${s.vt ?? 0}</li>
        <li><b>Peso:</b> ${s.peso ?? 0}</li>
        <li><b>Dano:</b> ${s.dano ?? "-"}</li>
        <li><b>Conceito:</b> ${s.conceito ?? "-"}</li>
        
      </ul>
    </div>
    `;
    //<li><b>Preço:</b> ${s.preco ?? "-"}</li>
    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content
    });
  }
  async _onMostrarAlquimico(event) {
    event.preventDefault();

    const itemId = event.currentTarget.dataset.itemId;
    if (!itemId) return;

    const item = this.actor.items.get(itemId);
    if (!item) return;

    const s = item.system;
  
    let content = `
    <div class="chat-item">
      <h2>${item.name}</h2>      
      <img src='${item.img}'>
      <ul>
        <li><b>Nível:</b> ${s.nivel ?? 0}</li>
        <li><b>Tipo:</b> ${s.tipo ?? "-"}</li>
        <li><b>Técnica:</b> ${s.tecnica ?? "-"}</li>
        <li><b>Alvo/Efeito:</b> ${s.alvo ?? "-"}</li>
        <li><b>Efeito Secundário:</b> ${s.efeito ?? "-"}</li>
        <li><b>Dano:</b> ${s.dano ?? "-"}</li>
        
      </ul>
    </div>
    `;
    //<li><b>Preço:</b> ${s.preco ?? "-"}</li>
    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content
    });
  }
  async _onMostrarDroga(event) {
    event.preventDefault();

    const itemId = event.currentTarget.dataset.itemId;
    if (!itemId) return;

    const item = this.actor.items.get(itemId);
    if (!item) return;

    const s = item.system;
  
    let content = `
    <div class="chat-item">
      <h2>${item.name}</h2>      
      <img src='${item.img}'>
      <ul>
        <li><b>Tipo:</b> ${s.tipo ?? "-"}</li>
        <li><b>Efeito:</b> ${s.efeito ?? "-"}</li>
        <li><b>Efeito Colateral:</b> ${s.colateral ?? "-"}</li>
        
      </ul>
    </div>
    `;
    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content
    });
  }
  async _onMostrarImplante(event) {
    event.preventDefault();

    const itemId = event.currentTarget.dataset.itemId;
    if (!itemId) return;

    const item = this.actor.items.get(itemId);
    if (!item) return;

    const s = item.system;
  
    let content = `
    <div class="chat-item">
      <h2>${item.name}</h2>      
      <img src='${item.img}'>
      <ul>
        <li><b>Efeito:</b> ${s.efeito ?? "-"}</li>
        <li><b>Essência:</b> ${s.essencia ?? 0}</li>
        <li><b>Conceito:</b> ${s.conceito ?? "-"}</li>
        
      </ul>
    </div>
    `;
    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content
    });
  }
  async _onMostrarMagia(event) {
    event.preventDefault();

    const itemId = event.currentTarget.dataset.itemId;
    if (!itemId) return;

    const item = this.actor.items.get(itemId);
    if (!item) return;

    const s = item.system;
    let nomecirculo = "";
    if (s.circulo > 3){
      nomecirculo = "REVELAÇÃO";
    }else if (s.circulo > 2){
      nomecirculo = "PERDIÇÃO";
    }else if (s.circulo > 1){
      nomecirculo = "VIOLAÇÃO";
    }else if (s.circulo > 0){
      nomecirculo = "DEGRADAÇÃO";
    }else{
      nomecirculo = "🤷‍♂️";
    }
  
    let content = `
    <div class="chat-item">
      <h2>${item.name}</h2>      
      <img src='${item.img}'>
      <ul>
        <li><b>Circulo:</b> ${nomecirculo}</li>
        <li><b>Efeito:</b> ${s.efeito ?? "-"}</li>
        <li><b>Essência:</b> ${s.essencia ?? 0}</li>
        <li><b>Conceito:</b> ${s.conceito ?? "-"}</li>
        <li><b>Dano a Sanidade:</b> ${s.dano ?? 0}</li>
        
      </ul>
    </div>
    `;
    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content
    });
  }
  async _onMostrarRitual(event) {
    event.preventDefault();

    const itemId = event.currentTarget.dataset.itemId;
    if (!itemId) return;

    const item = this.actor.items.get(itemId);
    if (!item) return;

    const s = item.system;
  
    let content = `
    <div class="chat-item">
      <h2>${item.name}</h2>      
      <img src='${item.img}'>
      <ul>
        <li><b>Efeito:</b> ${s.efeito ?? "-"}</li>
        <li><b>Essência:</b> ${s.essencia ?? "-"}</li>
        <li><b>Conceito:</b> ${s.conceito ?? "-"}</li>
        <li><b>Tempo:</b> ${s.tempo ?? "-"}</li>
        
      </ul>
    </div>
    `;
    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content
    });
  }
  async _onMostrarVeiculo(event) {
    event.preventDefault();

    const itemId = event.currentTarget.dataset.itemId;
    if (!itemId) return;

    const item = this.actor.items.get(itemId);
    if (!item) return;

    const s = item.system;
  
    let content = `
    <div class="chat-item">
      <h2>${item.name}</h2>      
      <img src='${item.img}'>
      <ul>
        <li><b>Exemplo:</b> ${s.ex ?? "-"}</li>
        <li><b>VEL:</b> ${s.vel ?? 0} | <b>EST:</b> ${s.est ?? 0} | <b>BLD:</b> ${s.bld ?? 0} | <b>POT:</b> ${s.pot ?? 0}</li>
        
      </ul>
    </div>
    `;
    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content
    });
  }
  
  async _onMostrarMecha(event) {
    event.preventDefault();

    const itemId = event.currentTarget.dataset.itemId;
    if (!itemId) return;

    const item = this.actor.items.get(itemId);
    if (!item) return;

    const s = item.system;
  
    let content = `
    <div class="chat-item">
      <h2>${item.name}</h2>      
      <img src='${item.img}'>
      <ul>
        <li><b>Tipo:</b> ${s.tipo ?? "-"}</li>
        <li><b>EST:</b> ${s.est ?? 0} | <b>BLD:</b> ${s.bld ?? 0} | <b>MOB:</b> ${s.mob ?? 0} | <b>PRE:</b> ${s.pre ?? 0} | <b>POT:</b> ${s.pot ?? 0}</li>
        
      </ul>
    </div>
    `;
    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content
    });
  }

  async _onMostrarAlquimia(event) {
    event.preventDefault();

    const itemId = event.currentTarget.dataset.itemId;
    if (!itemId) return;

    const item = this.actor.items.get(itemId);
    if (!item) return;

    const s = item.system;
  
    let content = `
    <div class="chat-item">
      <h2>${item.name}</h2>      
      <img src='${item.img}'>
      <ul>
        <li><b>Efeito:</b> ${s.efeito ?? "-"}</li>
        <li><b>Conceito:</b> ${s.conceito ?? "-"}</li>
        <li><b>Tempo:</b> ${s.tempo ?? "-"}</li>
        
      </ul>
    </div>
    `;
    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content
    });
  }
  async _onMostrarAcido(event) {
    event.preventDefault();

    const itemId = event.currentTarget.dataset.itemId;
    if (!itemId) return;

    const item = this.actor.items.get(itemId);
    if (!item) return;

    const s = item.system;
  
    let content = `
    <div class="chat-item">
      <h2>${item.name}</h2>      
      <img src='${item.img}'>
      <ul>
        <li><b>Tipo:</b> ${s.tipo ?? "-"}</li>
        <li><b>Efeito:</b> ${s.efeito ?? "-"}</li>
        <li><b>Conceito:</b> ${s.conceito ?? "-"}</li>
        
      </ul>
    </div>
    `;
    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content
    });
  }
  async _onMostrarVeneno(event) {
    event.preventDefault();

    const itemId = event.currentTarget.dataset.itemId;
    if (!itemId) return;

    const item = this.actor.items.get(itemId);
    if (!item) return;

    const s = item.system;
  
    let content = `
    <div class="chat-item">
      <h2>${item.name}</h2>      
      <img src='${item.img}'>
      <ul>
        <li><b>Tipo:</b> ${s.tipo ?? "-"}</li>
        <li><b>Efeito:</b> ${s.efeito ?? "-"}</li>
        <li><b>Conceito:</b> ${s.conceito ?? "-"}</li>
        
      </ul>
    </div>
    `;
    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content
    });
  }
  async _onMostrarInjecao(event) {
    event.preventDefault();

    const itemId = event.currentTarget.dataset.itemId;
    if (!itemId) return;

    const item = this.actor.items.get(itemId);
    if (!item) return;

    const s = item.system;
  
    let content = `
    <div class="chat-item">
      <h2>${item.name}</h2>      
      <img src='${item.img}'>
      <ul>
        <li><b>Efeito:</b> ${s.efeito ?? "-"}</li>
        <li><b>Efeito Colateral:</b> ${s.colateral ?? "-"}</li>
        <li><b>Conceito:</b> ${s.conceito ?? "-"}</li>
        
      </ul>
    </div>
    `;
    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content
    });
  }
  async _onMostrarElixir(event) {
    event.preventDefault();

    const itemId = event.currentTarget.dataset.itemId;
    if (!itemId) return;

    const item = this.actor.items.get(itemId);
    if (!item) return;

    const s = item.system;
  
    let content = `
    <div class="chat-item">
      <h2>${item.name}</h2>      
      <img src='${item.img}'>
      <ul>
        <li><b>Efeito:</b> ${s.efeito ?? "-"}</li>
        <li><b>Efeito Colateral:</b> ${s.colateral ?? "-"}</li>
        <li><b>Conceito:</b> ${s.conceito ?? "-"}</li>
        
      </ul>
    </div>
    `;
    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content
    });
  }
  async _onMostrarMutagenico(event) {
    event.preventDefault();

    const itemId = event.currentTarget.dataset.itemId;
    if (!itemId) return;

    const item = this.actor.items.get(itemId);
    if (!item) return;

    const s = item.system;
  
    let content = `
    <div class="chat-item">
      <h2>${item.name}</h2>      
      <img src='${item.img}'>
      <ul>
        <li><b>Efeito:</b> ${s.efeito ?? "-"}</li>
        <li><b>Mutação:</b> ${s.mutacao ?? "-"}</li>
        <li><b>Conceito:</b> ${s.conceito ?? "-"}</li>
        
      </ul>
    </div>
    `;
    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content
    });
  }
  

}
