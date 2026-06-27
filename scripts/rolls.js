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

  const atributoValor = Number(actor.system.atributos[atributoEscolhido] ?? 0);
  const valorPericia = Number(periciaData.valor ?? 0);
  const bonusPericia = Number(periciaData.bonus ?? 0);
  const base = Number(periciaCfg.base ?? 0);
  const grupopen = (periciaCfg.penalidade ?? '');
  const pen = Number(actor.system.penalidades[grupopen] ?? 0);
  
  const alvo = atributoValor + valorPericia + bonusPericia + base - pen;

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
      ${atributoValor} + (${valorPericia} + ${bonusPericia}) - ${pen}) = <b>${alvo}</b><br><br>
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

  const valor = Number(actor.system.atributos[atributoKey] ?? 0);
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
  // // 🎲 MOSTRA OS DADOS 3D NA MESA
  // if (game.dice3d) {
  //   await game.dice3d.showForRoll(roll, game.user, true);
  // }
  const total = roll.total + atributoValor;
  if (atributo != "") {
    rolagem = `${formula} + ${atributo} (${atributoValor})`;
  }else{
    rolagem = `${formula}`;
  }

  roll.toMessage({
    speaker: ChatMessage.getSpeaker({ actor }),
    flavor: `
      <b>${itemName}</b><br>
      <b>Dano:</b> ${textoOriginal}<br>
      ${rolagem}<br><br>
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
