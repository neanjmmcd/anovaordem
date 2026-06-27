export class AONovaOrdemInjecaoSheet extends ItemSheet {

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["a-nova-ordem", "sheet", "item", "injecao"],
      template: "systems/a-nova-ordem/sheets/item-injecao.html",
      width: 500,
      height: 450
    });
  }

  getData() {
    const context = super.getData();
    context.system = this.item.system;
    return context;
  }
}
