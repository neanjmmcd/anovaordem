Hooks.on("updateItem", async (item, data) => {
  
  const actor = item.parent;
  if (!actor) return;
  if (item.type == "armadura"){
    await actor.update({
      "system.armadura": {
        tipo: item.system.tipo,
        peso: item.system.peso,
        rd: item.system.rd,
        penalidades: item.system.penalidades
      }
    });
  }
  if (item.type == "items"){
    await actor.update({
      "system.items": {
        tipo: item.system.tipo,
        peso: item.system.peso,
        efeito: item.system.efeito,
        uso: item.system.uso
      }
    });
  }
  if (item.type == "arma"){
    await actor.update({
      "system.arma": {
        nome: item.system.nome,
        dano: item.system.dano,
        tipo: item.system.tipo,
        vt: item.system.vt,
        peso: item.system.peso
      }
    });
  }
  return;
});
