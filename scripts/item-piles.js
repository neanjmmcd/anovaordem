/* =========================
 * INTEGRAÇÃO COM ITEM PILES (opcional)
 * Só roda se o módulo Item Piles estiver ativo. Diz ao módulo onde
 * ficam quantidade, preço e o dinheiro (¢RD) do personagem.
 * ========================= */

Hooks.once("item-piles-ready", async () => {
  const api = game.itempiles?.API;
  if (!api?.addSystemIntegration) return;

  api.addSystemIntegration({
    VERSION: "1.0.0",

    // Tipo de ator usado para criar pilhas, baús e lojas
    ACTOR_CLASS_TYPE: "personagem",
    ITEM_CLASS_LOOT_TYPE: "items",
    ITEM_CLASS_WEAPON_TYPE: "arma",
    ITEM_CLASS_EQUIPMENT_TYPE: "armadura",

    ITEM_QUANTITY_ATTRIBUTE: "system.quantidade",
    ITEM_PRICE_ATTRIBUTE: "system.preco",
    QUANTITY_FOR_PRICE_ATTRIBUTE: "flags.item-piles.system.quantityForPrice",

    // Conhecimentos e implantes não são saqueáveis
    ITEM_FILTERS: [
      { path: "type", filters: "magias,rituais,alquimico,alquimia,implantes" }
    ],
    ITEM_SIMILARITIES: ["name", "type"],
    UNSTACKABLE_ITEM_TYPES: ["arma", "armadura", "mecha", "veiculo"],

    CURRENCIES: [{
      type: "attribute",
      name: "Crédito RD",
      img: "icons/commodities/currency/coins-plain-stack-gold.webp",
      abbreviation: "¢{#}",
      data: { path: "system.creditoRd" },
      primary: true,
      exchangeRate: 1
    }],
    SECONDARY_CURRENCIES: []
  });

  console.log("A Nova Ordem | Integração com Item Piles registrada");
});
