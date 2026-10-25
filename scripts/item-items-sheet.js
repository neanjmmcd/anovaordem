export class AONovaOrdemItemsSheet extends ItemSheet {

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["a-nova-ordem", "sheet", "item", "items"],
      template: "systems/a-nova-ordem/sheets/item-items.html",
      width: 560,
      height: 680
    });
  }

  getData() {
    const context = super.getData();
    context.system = this.item.system;
    context.config = CONFIG.AONOVAORDEM;
    return context;
  }
}
