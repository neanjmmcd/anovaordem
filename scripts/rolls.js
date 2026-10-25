/* =========================
 * ROLAR PERÍCIA
 * ========================= */
export async function rolarPericia(actor, periciaKey) {
  
  const periciaCfg = CONFIG.AONOVAORDEM.pericias[periciaKey];
  if (!periciaCfg) return;

  const periciaData = actor.system.pericias[periciaKey] ?? {
    valor: 0,
    bonus: 0,
  };
  
  let atributoEscolhido = periciaCfg.atributos[0];
  
  // Escolher atributo se houver mais de um
  if (periciaCfg.atributos.length > 1) {
    atributoEscolhido = await escolherAtributo(periciaCfg.atributos);
    if (!atributoEscolhido) return;
  }

  // Valores efetivos (com modificadores de itens) calculados em actor-model.js
  const sys = actor.system;
  const atributoValor = Number(sys.atributosTotais?.[atributoEscolhido] ?? sys.atributos[atributoEscolhido] ?? 0);
  const valorPericia = Number(periciaData.valor ?? 0);
  const bonusPericia = Number(periciaData.bonus ?? 0) + Number(sys.periciasItens?.[periciaKey] ?? 0);
  const base = Number(periciaCfg.base ?? 0);
  const grupopen = (periciaCfg.penalidade ?? '');
  const pen = Number(sys.penalidadesTotais?.[grupopen] ?? sys.penalidades[grupopen] ?? 0);

  let alvo = atributoValor + valorPericia + bonusPericia + base - pen;
  // Dreno de Essência ≤20%: Perícias Sociais pela metade
  const metade = sys.metadeSociais && grupopen === "pensociais";
  if (metade) alvo = Math.floor(alvo / 2);

  const roll = await new Roll("1d100").roll({ async: true });
  const resultado = roll.total;

  let grau = "❌ Falha ❌";
  if (resultado <= 4) grau = "💥 SUCESSO CRÍTICO 💥";
  else if (resultado >= 96) grau = "💀 FALHA CRÍTICA 💀";
  else if (resultado <= alvo) grau = "✅ Sucesso ✅";

  roll.toMessage({
    speaker: ChatMessage.getSpeaker({ actor }),
    flavor: `
      <b>${periciaCfg.label}</b><br>
      ${atributoEscolhido.toUpperCase()} + Perícia(Base + Bonus) - penalidade:<br>
      ${atributoValor} + (${valorPericia} + ${bonusPericia}) - ${pen}) = <b>${alvo}</b>${metade ? " (½ Dreno de Essência)" : ""}<br><br>
      <b>${grau}</b>
    `
  });
}
 /*
  Atributo: ${atributoEscolhido.toUpperCase()} (${atributoValor})<br>
  Perícia: ${valorPericia} | Bônus: ${bonusPericia}<br>
  <b>Alvo: ${alvo}</b><br></br>
  */
/* =========================
 * ROLAR ATRIBUTO
 * ========================= */
export async function rolarAtributo(actor, atributoKey) {

  const valor = Number(actor.system.atributosTotais?.[atributoKey] ?? actor.system.atributos[atributoKey] ?? 0);
  const roll = await new Roll("1d100").roll({ async: true });
  const resultado = roll.total;
  
  let grau = "❌ Falha ❌";
  if (resultado <= 4) grau = "💥 SUCESSO CRÍTICO 💥";
  else if (resultado >= 96) grau = "💀 FALHA CRÍTICA 💀";
  else if (resultado <= valor) grau = "✅ Sucesso ✅";

  roll.toMessage({
    speaker: ChatMessage.getSpeaker({ actor }),
    flavor: `
      <b>${atributoKey.toUpperCase()}</b><br>
      <b>Alvo:</b> ${valor}<br><br>
      <b>${grau}</b>
    `
  });
}

/* =========================
 * ROLAR DANO
 * ========================= */
export async function rolarDano({actor, itemName, formula, atributo, atributoValor, textoOriginal
}) {
  let rolagem = ``;
  const roll = await new Roll(formula).roll({ async: true });
  const total = roll.total + atributoValor;
  if (atributo != "") {
    rolagem = `${formula} + ${atributo.toUpperCase()} (${atributoValor})`;
  } else {
    rolagem = `${formula}`;
  }

  // Token marcado como alvo (mira) → aplicar dano com RD automaticamente
  const token = [...(game.user?.targets ?? [])][0];
  if (token) {
    const alvo = token.actor;
    const rd = alvo.system.rd ?? 0;
    const danoEfetivo = Math.max(0, total - rd);
    const saudeAtual = alvo.system.saude ?? 0;
    const saudeNova = Math.max(0, saudeAtual - danoEfetivo);
    const [statusTxt, penalidade] = status(saudeNova);

    if (danoEfetivo > 0) {
      await alvo.update({
        "system.saude": saudeNova,
        "system.penalidades.penfisica":        penalidade,
        "system.penalidades.pensociais":       penalidade,
        "system.penalidades.penmentais":       penalidade,
        "system.penalidades.pentecnicologica": penalidade,
        "system.penalidades.penaquimica":      penalidade,
        "system.penalidades.penmagica":        penalidade,
        "system.penalidades.pensobrevivencia": penalidade
      });
    }

    roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor }),
      flavor: `
        <b>${itemName}</b><br>
        <b>Dano:</b> ${textoOriginal}<br>
        ${rolagem} = <b>${total}</b><br>
        ${total} − RD ${rd} = <b style="color:red">${danoEfetivo}</b><br><br>
        <img src="${alvo.img}" width="36" height="36" style="border:0;border-radius:4px;vertical-align:middle">
        <b>${alvo.name}</b> — <b>${statusTxt}</b>
      `
    });
    return;
  }

  // Sem token → exibir botões no chat
  roll.toMessage({
    speaker: ChatMessage.getSpeaker({ actor }),
    flavor: `
      <b>${itemName}</b><br>
      <b>Dano:</b> ${textoOriginal}<br>
      ${rolagem}<br><br>
      <p>
      <button class="aplicar-dano" data-dano="${total}" title="Aplicar Dano">
        <b>-</b>
      </button>
      <b>Total: ${total}</b>
      <button class="aplicar-cura" data-cura="${total}" title="Aplicar Cura">
        <b>+</b>
      </button></p>
    `
  });
}

/* =========================
 * ROLAR ALQUIMICO
 * ========================= */
export async function rolarAlquimico({actor, alquimico}) {
  const al = alquimico;
  const roll = await new Roll(al.dano).roll({ async: true });

  const total = roll.total;

  roll.toMessage({
    speaker: ChatMessage.getSpeaker({ actor }),
    flavor: `
      <b>${al.pedra}</b><br>
      <b>Nível:</b> ${al.nivel}<br>
      <b>Técnica:</b> ${al.tecnica}<br>
      <b>Tipo:</b> ${al.tipo}<br>
      <b>Alvo/Efeito:</b> ${al.alvo}<br>
      <b>Efeito Secundário:</b> ${al.efeito}<br>
      <b>Dano:</b> ${al.dano}<br><br>
      
      <p>
      <button class="aplicar-dano" data-dano="${total}" title="Apicar Dano">
        <b>-</b>
      </button>
      <b>Total: ${total}</b>
      <button class="aplicar-cura" data-cura="${total}" title="Apicar Cura">
        <b>+</b>
      </button></p>
    `
  });
}


/* ========================= */

/* =========================
 * STATUS DE SAÚDE
 * ========================= */
export function status(saudeAtual) {
  if (saudeAtual > 75) return ['Operacional',        0];
  if (saudeAtual > 50) return ['Ferido',              5];
  if (saudeAtual > 25) return ['Gravemente Ferido',  10];
  if (saudeAtual > 2)  return ['À Beira do Colapso', 15];
  if (saudeAtual > 0)  return ['Incapacitado',       20];
  return                      ['Morto',             100];
}

/* =========================
 * ANIMAÇÕES (módulo Automated Animations, opcional)
 * Toca a animação configurada para o item no menu de Reconhecimento
 * Automático do Automated Animations (pelo nome do item).
 * Sem o módulo ativo, não faz nada.
 * ========================= */
export function tocarAnimacao(actor, item, { noProprio = false } = {}) {
  const aa = globalThis.AutomatedAnimations;
  if (!game.modules.get("autoanimations")?.active || typeof aa?.playAnimation !== "function") return;

  const token = actor?.getActiveTokens?.()[0] ?? canvas.tokens.controlled[0];
  if (!token) return;

  const alvos = noProprio ? [token] : [...game.user.targets];
  try {
    aa.playAnimation(token, item, { targets: alvos, hitTargets: alvos });
  } catch (err) {
    console.warn("A Nova Ordem | Falha ao tocar animação:", err);
  }
}

/* =========================
 * ESTADO MENTAL (SANIDADE)
 * Retorna [estado, efeito] conforme a tabela de Estados Mentais do manual
 * ========================= */
export function statusSanidade(sanidade) {
  if (sanidade > 80) return ['Mente Sã',       'Nenhuma penalidade.'];
  if (sanidade > 60) return ['Mente Abalada',  '−10% em perícias Mentais.'];
  if (sanidade > 40) return ['Mente Fraturada','−20% em perícias Mentais; −10% em perícias Sociais. Ilusões inofensivas.'];
  if (sanidade > 20) return ['Colapso Mental', '−50% em perícias Mentais; −30% em perícias Sociais. Feitiços exigem teste de Resistência Mental. Ilusões significativas e pequenos rompantes.'];
  if (sanidade > 0)  return ['Ruína Mental',   '−60% em perícias Mentais; −40% em perícias Sociais. Falhas em testes Mentais podem impor comportamento compulsivo. Ilusões agressivas causam terror ou fúria.'];
  return                    ['Mente Vazia',    'Incapacitado mentalmente: não conjura feitiços, não realiza testes Mentais ou Sociais. Morto por dentro.'];
}

function escolherAtributo(lista) {
  return new Promise(resolve => {

    const buttons = {};
    for (const atr of lista) {
      buttons[atr] = {
        label: atr.toUpperCase(),
        callback: () => resolve(atr)
      };
    }

    new Dialog({
      title: "Escolha o Atributo",
      content: "<p>Qual atributo será usado?</p>",
      buttons,
      close: () => resolve(null)
    }).render(true);
  });
}
