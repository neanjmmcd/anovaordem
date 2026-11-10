import { config, pedir, grau, botoesDanoCura } from "./combate.js";
import { cartao, enviarCartao, corDoGrau, CORES, textoAlvos } from "./cartao.js";

/** Pontos gastos na perícia (criação grava em valor; a ficha, em bônus) */
export function pontosPericia(actor, key) {
  const p = actor.system.pericias?.[key] ?? {};
  const base = Number(CONFIG.Actor.dataModels.personagem.schema.getField(`pericias.${key}.valor`)?.initial ?? 0);
  return Math.max(0, Number(p.valor ?? 0) - base) + Number(p.bonus ?? 0);
}

/** Perícia ST (somente treinado) sem pontos gastos não pode ser rolada. NPCs usam os grupos e sempre rolam */
export function periciaLiberada(actor, key) {
  const cfg = CONFIG.AONOVAORDEM;
  if (!actor || actor.type !== "personagem") return true;
  if (!cfg.gruposSomenteTreinado.includes(cfg.pericias[key]?.grupo)) return true;
  if (cfg.periciasSemTreino.includes(key)) return true;
  return pontosPericia(actor, key) > 0;
}

/** Aviso padrão; devolve true se pode rolar */
export function checarTreino(actor, key) {
  if (periciaLiberada(actor, key)) return true;
  ui.notifications.warn(`${actor.name} não tem treino em ${CONFIG.AONOVAORDEM.pericias[key]?.label ?? key} (perícia ST: só rola com pontos gastos).`);
  return false;
}

/* =========================
 * ROLAR PERÍCIA
 * ========================= */
export async function rolarPericia(actor, periciaKey) {
  
  const periciaCfg = CONFIG.AONOVAORDEM.pericias[periciaKey];
  if (!periciaCfg) return;
  if (!checarTreino(actor, periciaKey)) return;

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

  const roll = await new Roll("1d100").evaluate();
  const g = grau(roll.total, alvo);
  await enviarCartao({
    actor, rolls: [roll],
    html: cartao({
      img: actor.img, titulo: periciaCfg.label, subtitulo: actor.name + textoAlvos([...game.user.targets].map(t => t.actor)),
      calculo: `${atributoEscolhido.toUpperCase()} ${atributoValor} + Perícia ${valorPericia}${bonusPericia ? ` + Bônus ${bonusPericia}` : ""}`
        + `${pen ? ` − Penalidade ${pen}` : ""} = <b>${alvo}%</b>${metade ? " (½ Dreno de Essência)" : ""} · d100 = <b>${roll.total}</b>`,
      resultado: `<b>${g.texto}</b>`, cor: corDoGrau(g)
    })
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
  const roll = await new Roll("1d100").evaluate();
  const g = grau(roll.total, valor);
  await enviarCartao({
    actor, rolls: [roll],
    html: cartao({
      img: actor.img, titulo: CONFIG.AONOVAORDEM.atributos[atributoKey]?.label ?? atributoKey.toUpperCase(), subtitulo: actor.name,
      calculo: `Alvo: <b>${valor}%</b> · d100 = <b>${roll.total}</b>`,
      resultado: `<b>${g.texto}</b>`, cor: corDoGrau(g)
    })
  });
}

/* =========================
 * ROLAR DANO
 * ========================= */
export async function rolarDano({actor, itemName, formula, atributo, atributoValor, textoOriginal, img
}) {
  const roll = await new Roll(formula).evaluate();
  const total = roll.total + atributoValor;
  const rolagem = atributo ? `${formula} + ${atributo.toUpperCase()} (${atributoValor})` : `${formula}`;
  const calculo = `<b>Dano:</b> ${textoOriginal}<br>${rolagem} = <b>${total}</b>`;

  // Token marcado como alvo (mira) → aplicar dano com RD (se a automação estiver ligada)
  const token = [...(game.user?.targets ?? [])][0];
  if (token && config().ativo) {
    const alvo = token.actor;
    const rd = Number(alvo.system.rd ?? 0);
    const danoEfetivo = Math.max(1, total - rd);
    await enviarCartao({
      actor, rolls: [roll],
      html: cartao({
        img: img ?? actor.img, titulo: itemName, subtitulo: actor.name,
        calculo: `${calculo}<br>${total} − RD ${rd} = <b style="color:red">${danoEfetivo}</b>`,
        resultado: `Dano em <b>${alvo.name}</b>`, cor: CORES.dano
      })
    });
    await pedir("dano", { uuid: alvo.uuid, dano: danoEfetivo });
    return;
  }

  // Sem alvo → botões − / + no chat
  await enviarCartao({
    actor, rolls: [roll],
    html: cartao({
      img: img ?? actor.img, titulo: itemName, subtitulo: actor.name,
      calculo, resultado: "<b>Dano rolado</b>", cor: CORES.dano, extra: botoesDanoCura(total)
    })
  });
}

/* =========================
 * ROLAR ALQUIMICO
 * ========================= */
export async function rolarAlquimico({actor, alquimico, img}) {
  const al = alquimico;
  const roll = await new Roll(al.dano).evaluate();
  const total = roll.total;
  await enviarCartao({
    actor, rolls: [roll],
    html: cartao({
      img: img ?? actor.img, titulo: al.pedra, subtitulo: actor.name,
      calculo: `<b>Nível:</b> ${al.nivel} · <b>Técnica:</b> ${al.tecnica} · <b>Tipo:</b> ${al.tipo}<br>`
        + `<b>Alvo/Efeito:</b> ${al.alvo}<br><b>Efeito Secundário:</b> ${al.efeito}<br>`
        + `<b>Dano:</b> ${al.dano} = <b>${total}</b>`,
      resultado: "<b>Dano rolado</b>", cor: CORES.dano, extra: botoesDanoCura(total, true)
    })
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
  return                    ['Mente Vazia',    'Mente vazia, sem meios clínicos para reverter: a personagem é considerada morta.'];
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
