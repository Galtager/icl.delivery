sap.ui.define(["sap/ui/core/UIComponent", "./BaseController", "sap/ui/model/Filter", "sap/ui/model/FilterOperator", "sap/m/MessageBox"], function (UIComponent, __BaseController, Filter, FilterOperator, MessageBox) {
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const BaseController = _interopRequireDefault(__BaseController);
  /**
   * @namespace icl.delivery.controller
   */
  const MultiCollect = BaseController.extend("icl.delivery.controller.MultiCollect", {
    onAfterRendering: function _onAfterRendering() {
      this.disableComboBox('noWriteCombo3');
    },
    onInit: function _onInit() {
      BaseController.prototype.onInit.call(this);
      const oRouter = UIComponent.getRouterFor(this);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      oRouter.getRoute("multiCollect").attachMatched(this._initialFunc, this);
    },
    _initialFunc: function _initialFunc() {
      this.initTableSelections('multiItemsTable');
      const deliveryModel = this.getDelivModel();
      deliveryModel.setProperty('/oFlags/headerNavBack', true);
      deliveryModel.setProperty('/currView', 'multiCollect');
      const collects = this.loadCollects(deliveryModel);
      if (!collects.length) {
        this.onNavBack();
      }
      deliveryModel.setProperty('/oMaintain/multiCollect/collectFilter', collects.map(col => col.reqNumber));
      void this.loadItems(deliveryModel, collects);
    },
    loadItems: async function _loadItems(deliveryModel, collects) {
      const allItems = [];
      // fetch all selected collects items
      for (let i = 0; i < collects.length; i++) {
        await fetch("/mockData/collectItems.JSON").then(res => res.json()).then(data => {
          const items = data.filter(item => {
            if (item.requestId === collects[i].requestId) {
              item.reqNumber = collects[i].reqNumber;
              return true;
            }
            return false;
          });
          allItems.push(...items);
        });
      }
      deliveryModel.setProperty('/oData/multiCollectItems', allItems);
    },
    loadCollects: function _loadCollects(deliveryModel) {
      const collectsList = deliveryModel.getProperty('/oData/collectList');
      if (collectsList) {
        const selCollects = collectsList.filter(coll => coll.selected);
        selCollects.map((el, i) => el.reqNumber = i + 1);
        deliveryModel.setProperty('/oMaintain/multiCollect/currCollects', selCollects);
        return selCollects;
      }
      return [];
    },
    onStartCollectDialog: function _onStartCollectDialog(oEvent) {
      const deliveryModel = this.getDelivModel();
      // check if have error before start -- need to fetch server
      deliveryModel.setProperty('/oMaintain/share/showStartDialog', true);
      void this.onFragmentHandler(oEvent, 'Dialog_StartCollect', true);
      deliveryModel.setProperty('/oMaintain/multiCollect/start', true);
      setTimeout(() => {
        void this.cancelFragment(oEvent, 'Dialog_StartCollect');
      }, 1500);
    },
    filter: function _filter() {
      const deliveryModel = this.getDelivModel(),
        table = this.getView().byId('multiItemsTable'),
        oBinding = table.getBinding("items"),
        filters = [];
      const collectFilters = deliveryModel.getProperty('/oMaintain/multiCollect/collectFilter');
      const searchFilter = deliveryModel.getProperty('/oMaintain/multiCollect/searchFilter');

      // search filters
      searchFilter && filters.push(new Filter('catNum', FilterOperator.Contains, searchFilter));
      // collect filters
      const collectOrFilters = collectFilters.map(collectFilter => new Filter('reqNumber', FilterOperator.EQ, collectFilter));
      collectOrFilters.length && filters.push(new Filter({
        filters: collectOrFilters,
        and: false
      }));
      oBinding.filter(filters);
    },
    onFinishCollects: function _onFinishCollects(oEvent) {
      const table = this.getView().byId('multiItemsTable');
      if (table.getItems().length === table.getSelectedItems().length) {
        this.navTo('preview');
        this.groupByCollectReq();
      } else MessageBox.show('לא סימנת את כל הפריטים');
    },
    groupByCollectReq: function _groupByCollectReq() {
      const deliveryModel = this.getDelivModel();
      const selCollects = deliveryModel.getProperty('/oMaintain/multiCollect/currCollects');
      const collectsItems = deliveryModel.getProperty('/oData/multiCollectItems');
      const groupedCollects = selCollects.map(collect => {
        const collectItems = collectsItems.filter(item => item.reqNumber === collect.reqNumber);
        collect.items = collectItems;
        return collect;
      });
      deliveryModel.setProperty('/oMaintain/multiCollect/previewItems', groupedCollects);
      console.log(groupedCollects);
    }
  });
  return MultiCollect;
});
//# sourceMappingURL=MultiCollect.controller.js.map