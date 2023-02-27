sap.ui.define(["sap/ui/core/UIComponent", "./BaseController"], function (UIComponent, __BaseController) {
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const BaseController = _interopRequireDefault(__BaseController);
  /**
   * @namespace icl.delivery.controller
   */
  const Preview = BaseController.extend("icl.delivery.controller.Preview", {
    onInit: function _onInit() {
      BaseController.prototype.onInit.call(this);
      const oRouter = UIComponent.getRouterFor(this);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      oRouter.getRoute("preview").attachMatched(this._initialFunc, this);
    },
    _initialFunc: function _initialFunc() {
      const deliveryModel = this.getDelivModel();
      deliveryModel.setProperty('/currView', 'preview');
      deliveryModel.setProperty('/oMaintain/previewAccept', false);
    },
    checkSelected: function _checkSelected(oEvent) {
      const deliveryModel = this.getDelivModel();
      if (oEvent.getParameter('selected')) {
        // check there is some selected
        const items = deliveryModel.getProperty('/oMaintain/multiCollect/previewItems');
        const allSelected = items.every(item => item.acceptCollect);
        deliveryModel.setProperty('/oMaintain/previewAccept', allSelected);
      } else {
        deliveryModel.setProperty('/oMaintain/previewAccept', false);
      }
    },
    onPrintFinish: function _onPrintFinish(oEvent) {
      // lock the screen and show after collect state
      this.cancelFragment(oEvent, 'Dialog_FinishMulti');
      void this.onFragmentHandler(oEvent, 'Dialog_Print', true);
    },
    finishMulti: function _finishMulti(oEvent) {
      void this.onFragmentHandler(oEvent, 'Dialog_FinishMulti', true);
    }
  });
  return Preview;
});
//# sourceMappingURL=Preview.controller.js.map