sap.ui.define(["sap/ui/core/UIComponent", "./BaseController", "sap/ui/model/Filter", "sap/ui/model/FilterOperator", "sap/m/MessageBox"], function (UIComponent, __BaseController, Filter, FilterOperator, MessageBox) {
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const BaseController = _interopRequireDefault(__BaseController);
  /**
   * @namespace icl.delivery.controller
   */
  const Collect = BaseController.extend("icl.delivery.controller.Collect", {
    onAfterRendering: function _onAfterRendering() {
      this.disableComboBox('noWriteCombo2');
    },
    onInit: function _onInit() {
      BaseController.prototype.onInit.call(this);
      const oRouter = UIComponent.getRouterFor(this);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      oRouter.getRoute("collect").attachMatched(this._initialFunc, this);
    },
    _initialFunc: function _initialFunc() {
      this.initTableSelections('itemsTable');
      const deliveryModel = this.getDelivModel();
      deliveryModel.setProperty('/oMaintain/title', delComponent.i18n('collectFrom'));
      deliveryModel.setProperty('/oFlags/headerNavBack', true);
      deliveryModel.setProperty('/currView', 'collect');
      const currCollect = deliveryModel.getProperty('/oMaintain/collect/currCollect');
      if (currCollect) {
        this.loadItems(deliveryModel);
      } else this.onNavBack();
    },
    loadItems: function _loadItems(deliveryModel) {
      void fetch("/mockData/collectItems.JSON").then(res => res.json()).then(data => {
        deliveryModel.setProperty('/oData/collectItems', data);
      });
    },
    filterItems: function _filterItems(oEvent) {
      const searchValue = oEvent.getParameter('newValue'),
        table = this.getView().byId('itemsTable'),
        oBinding = table.getBinding("items"),
        filters = [new Filter('catNum', FilterOperator.Contains, searchValue)];
      oBinding.filter(searchValue ? filters : null);
    },
    onStartCollectDialog: function _onStartCollectDialog(oEvent) {
      const deliveryModel = this.getDelivModel();

      // check if have error before start -- need to fetch server
      deliveryModel.setProperty('/oMaintain/collect/startError', 'הפק"ע סגורה');
      void this.onFragmentHandler(oEvent, 'Dialog_StartCollect', true);
    },
    startCollect: function _startCollect(oEvent) {
      const deliveryModel = this.getDelivModel();
      deliveryModel.setProperty('/oMaintain/share/showStartDialog', true);
      deliveryModel.setProperty('/oMaintain/collect/start', true);
      setTimeout(() => {
        void this.cancelFragment(oEvent, 'Dialog_StartCollect');
      }, 1500);
    },
    showBlob: function _showBlob() {
      alert('show blob as url');
    },
    onFinishCollect: function _onFinishCollect(oEvent) {
      const deliveryModel = this.getDelivModel();
      const table = this.getView().byId('itemsTable');
      if (table.getItems().length === table.getSelectedItems().length) {
        deliveryModel.setProperty('/oMaintain/collect/endCollect', {
          materialNum: '123456777'
        });
        // send post request to sap then get response for material number
        void this.onFragmentHandler(oEvent, 'Dialog_FinishCollect', true);
      } else MessageBox.show('לא סימנת את כל הפריטים');
    },
    onPrintFinish: function _onPrintFinish(oEvent) {
      const deliveryModel = this.getDelivModel();
      // lock the screen and show after collect state
      deliveryModel.setProperty('/oMaintain/collect/endCollect/finish', true);
      deliveryModel.setProperty('/oMaintain/collect/start', false);
      void this.cancelFragment(oEvent, 'Dialog_FinishCollect');
    },
    onDigitalSignDialog: async function _onDigitalSignDialog(oEvent) {
      await this.onFragmentHandler(oEvent, 'Dialog_DigitSign', true);
      this.cleanSign();
      this.attachSignEvent();
    },
    attachSignEvent: function _attachSignEvent() {
      const vbox = sap.ui.getCore().byId('signaturePad');
      const signaturePad = vbox.getItems()[0];
      signaturePad.attachBrowserEvent('click', () => {
        const deliveryModel = this.getDelivModel();
        deliveryModel.setProperty('/oMaintain/collect/sign', true);
      });
    },
    cleanSign: function _cleanSign() {
      const deliveryModel = this.getDelivModel();
      deliveryModel.setProperty('/oMaintain/countedForm/signature', true);
      const VBox = sap.ui.getCore().byId('signaturePad');
      const signaturePad = VBox.getItems()[0];
      signaturePad.clear();
      deliveryModel.setProperty('/oMaintain/collect/sign', false);
    },
    deleteReq: function _deleteReq(oEvent) {
      this.cancelFragment(oEvent, 'Dialog_DeleteReq');
      this.navTo('main');
    }
  });
  return Collect;
});
//# sourceMappingURL=Collect.controller.js.map