sap.ui.define(["./BaseController", "sap/ui/core/UIComponent", "sap/ui/model/Filter", "sap/ui/model/FilterOperator"], function (__BaseController, UIComponent, Filter, FilterOperator) {
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const BaseController = _interopRequireDefault(__BaseController);
  /**
   * @namespace icl.delivery.controller
   */
  const CreateRequest = BaseController.extend("icl.delivery.controller.CreateRequest", {
    onInit: function _onInit() {
      BaseController.prototype.onInit.call(this);
      const oRouter = UIComponent.getRouterFor(this);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      oRouter.getRoute("createRequest").attachMatched(this._initialFunc, this);
    },
    _initialFunc: function _initialFunc() {
      this.initTableSelections('createReqItems');
      const deliveryModel = this.getDelivModel();
      deliveryModel.setProperty('/oFlags/headerNavBack', true);
      deliveryModel.setProperty('/currView', 'createRequest');
      deliveryModel.setProperty('/oMaintain/createReq', {
        step: '1'
      });
    },
    searchArmor: function _searchArmor(oEvent) {
      const query = oEvent.getParameter('query');
      const deliveryModel = this.getDelivModel();
      void fetch("/mockData/collectItems.JSON").then(res => res.json()).then(data => {
        const filterItems = data.filter(item => item.armorId === query);
        deliveryModel.setProperty('/oMaintain/createReq/armorSel', filterItems.length ? query : '');
        deliveryModel.setProperty('/oData/armorItems', filterItems.length ? filterItems : []);
      });
    },
    checked: function _checked(oEvent) {
      const deliveryModel = this.getDelivModel();
      const li = oEvent.getParameter('listItem');
      const checked = oEvent.getParameter('selected');
      const itemPath = li.getBindingContext('DelModel').getPath();
      deliveryModel.setProperty(`${itemPath}/selected`, checked);
      if (checked) deliveryModel.setProperty('/oMaintain/createReq/continue', checked);else {
        // check how many selected
        const items = deliveryModel.getProperty('/oData/armorItems');
        const atLeastOne = items.some(item => item.selected);
        deliveryModel.setProperty('/oMaintain/createReq/continue', atLeastOne);
      }
    },
    cancelArmor: function _cancelArmor() {
      const deliveryModel = this.getDelivModel();
      this.onNavBack();
      deliveryModel.setProperty('/oData/armorItems', []);
    },
    preview: function _preview() {
      this.filterTable(new Filter('selected', FilterOperator.EQ, true));
      this.setStep('2');
    },
    backToEdit: function _backToEdit() {
      this.filterTable(null);
      this.setStep('1');
    },
    filterTable: function _filterTable(filter) {
      const table = this.getView().byId('createReqItems'),
        oBinding = table.getBinding("items");
      oBinding.filter(filter);
    },
    setStep: function _setStep(step) {
      const deliveryModel = this.getDelivModel();
      deliveryModel.setProperty('/oMaintain/createReq/step', step);
    }
  });
  return CreateRequest;
});
//# sourceMappingURL=CreateRequest.controller.js.map