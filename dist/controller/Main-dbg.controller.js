sap.ui.define(["sap/ui/core/UIComponent", "./BaseController", "sap/ui/model/Filter", "sap/ui/model/FilterOperator"], function (UIComponent, __BaseController, Filter, FilterOperator) {
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const BaseController = _interopRequireDefault(__BaseController);
  /**
   * @namespace icl.delivery.controller
   */
  const Main = BaseController.extend("icl.delivery.controller.Main", {
    onAfterRendering: function _onAfterRendering() {
      this.disableComboBox('noWriteCombo');
    },
    onInit: function _onInit() {
      BaseController.prototype.onInit.call(this);
      const oRouter = UIComponent.getRouterFor(this);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      oRouter.getRoute("main").attachMatched(this._initialFunc, this);
    },
    _initialFunc: function _initialFunc() {
      this.initTableSelections('collectList');
      const deliveryModel = this.getDelivModel();
      deliveryModel.setProperty('/oMaintain/title', delComponent.i18n('main_title'));
      deliveryModel.setProperty('/oFlags/headerNavBack', false);
      deliveryModel.setProperty('/currView', 'main');
      deliveryModel.setProperty('/currView', 'main');
      this.loadCollectList(deliveryModel);
    },
    loadCollectList: function _loadCollectList(deliveryModel) {
      void fetch("/mockData/CollectList.JSON").then(res => res.json()).then(data => {
        const {
          statsArray,
          typesArray
        } = this.groupBy(data);
        deliveryModel.setProperty('/oMaintain/collectionList', {
          groupByStatus: statsArray,
          groupByType: typesArray
        });
        deliveryModel.setProperty('/oData/collectList', data);
      });
    },
    groupBy: function _groupBy(data) {
      const statuses = {};
      const typees = {};
      data.map(req => {
        const {
          status,
          statusDesc,
          type
        } = req;
        //group statuses
        if (!statuses[status]) statuses[status] = {
          status,
          statusDesc,
          count: 1
        };else statuses[status].count += 1;
        //group types
        if (!typees[type]) typees[type] = {
          type,
          count: 1
        };else typees[type].count += 1;
      });
      const statsArray = Object.keys(statuses).map(el => statuses[el]);
      const typesArray = Object.keys(typees).map(el => typees[el]);
      statsArray.unshift({
        'count': data.length,
        status: '99',
        statusDesc: delComponent.i18n('all')
      });
      return {
        statsArray,
        typesArray
      };
    },
    checked: function _checked(oEvent) {
      const deliveryModel = this.getDelivModel();
      const li = oEvent.getParameter('listItem');
      const checked = oEvent.getParameter('selected');
      const itemPath = li.getBindingContext('DelModel').getPath();
      deliveryModel.setProperty(`${itemPath}/selected`, checked);

      // check how many selected
      const items = deliveryModel.getProperty('/oData/collectList');
      const atLeastOne = items.filter(item => item.selected);
      deliveryModel.setProperty('/oMaintain/collectionList/showListFooter', atLeastOne.length);
    },
    filter: function _filter() {
      const deliveryModel = this.getDelivModel(),
        list = this.getView().byId('collectList'),
        oBinding = list.getBinding("items"),
        filters = [];
      const {
        statusFilter,
        searchFilter,
        groupByType
      } = deliveryModel.getProperty('/oMaintain/collectionList');

      // search filters
      searchFilter && filters.push(this.getSerachFilter(searchFilter));
      // type filters
      const typeFilters = this.getTypeFilter(groupByType);
      typeFilters && filters.push(typeFilters);
      // status filter
      // not 'all' choic then filter
      if (statusFilter && statusFilter !== '99') {
        filters.push(new Filter("status", FilterOperator.Contains, statusFilter));
      }
      oBinding.filter(filters);
    },
    getSerachFilter: function _getSerachFilter(searchValue) {
      const searchFilters = new Filter({
        filters: [new Filter("requestId", FilterOperator.Contains, searchValue), new Filter("armorId", FilterOperator.Contains, searchValue), new Filter("askName", FilterOperator.Contains, searchValue)],
        and: false
      });
      return searchFilters;
    },
    getTypeFilter: function _getTypeFilter(options) {
      const typeFilters = [];
      options.map(type => {
        if (type.selected) {
          typeFilters.push(new Filter("type", FilterOperator.Contains, type.type));
        }
      });
      if (typeFilters.length) {
        return new Filter({
          filters: typeFilters,
          and: false
        });
      }
      return null;
    },
    navToCollect: function _navToCollect(oEvent) {
      const deliveryModel = this.getDelivModel();
      const collectReq = oEvent.getSource().getBindingContext('DelModel').getObject();
      // init collect page model
      deliveryModel.setProperty('/oMaintain/collect', {
        currCollect: collectReq
      });
      this.navTo('collect');
    },
    navToMultiCollect: function _navToMultiCollect(oEvent) {
      const deliveryModel = this.getDelivModel();
      deliveryModel.setProperty('/oMaintain/multiCollect', {});
      this.navTo('multiCollect');
    }
  });
  return Main;
});
//# sourceMappingURL=Main.controller.js.map