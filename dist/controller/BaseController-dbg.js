sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/core/UIComponent", "../model/formatter", "sap/ui/core/Fragment", "sap/ui/core/IconPool", "sap/ui/model/Sorter", "sap/m/MessageBox"], function (Controller, UIComponent, __formatter, Fragment, IconPool, Sorter, MessageBox) {
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const formatter = _interopRequireDefault(__formatter);
  /**
   * @namespace icl.delivery.controller
   */
  const BaseController = Controller.extend("icl.delivery.controller.BaseController", {
    constructor: function constructor() {
      Controller.prototype.constructor.apply(this, arguments);
      this.firstRun = true;
      this.formatter = formatter;
      this.fragments = {};
    },
    onInit: function _onInit() {
      const deliveryModel = this.getDelivModel();
      // run only 
      if (this.firstRun) {
        this.firstRun = false;
        this.loadIcons();
        this.loadUser(deliveryModel);
        this.loadSections(deliveryModel);
        this.loadSites(deliveryModel);
        this.loadTypes(deliveryModel);
        this.loadPersonalNumbers(deliveryModel);
        this.loadPrinters(deliveryModel);
      }
    },
    loadTypes: function _loadTypes(deliveryModel) {
      void fetch("/mockData/types.JSON").then(res => res.json()).then(data => deliveryModel.setProperty('/oData/types', data));
    },
    loadUser: function _loadUser(deliveryModel) {
      deliveryModel.setProperty('/user', {
        name: 'יורם אלקובי',
        contactName: 'יוסי אבוקסיס',
        tel: '0549080187',
        site: '12',
        sections: ['3', '10'],
        sectionsNames: ['חשמל 3', 'אינוונטר 17']
      });
    },
    loadSections: function _loadSections(deliveryModel) {
      void fetch("/mockData/sections.JSON").then(res => res.json()).then(data => deliveryModel.setProperty('/oData/sections', data));
    },
    loadSites: function _loadSites(deliveryModel) {
      void fetch("/mockData/sites.JSON").then(res => res.json()).then(data => deliveryModel.setProperty('/oData/sites', data));
    },
    loadPrinters: function _loadPrinters(deliveryModel) {
      void fetch("/mockData/printers.JSON").then(res => res.json()).then(data => {
        deliveryModel.setProperty('/oData/printers', data);
      });
    },
    getOwnerComponent: function _getOwnerComponent() {
      return Controller.prototype.getOwnerComponent.call(this);
    },
    getRouter: function _getRouter() {
      return UIComponent.getRouterFor(this);
    },
    navTo: function _navTo(sName, oParameters, bReplace) {
      this.getRouter().navTo(sName, oParameters, undefined, bReplace);
    },
    onNavBack: function _onNavBack() {
      window.history.go(-1);
    },
    getMainView: function _getMainView() {
      return this.getView() || this.viewController.getView();
    },
    cancelFragment: function _cancelFragment(oEvent, fragmentName) {
      const id = this.getMainView().getId() + '--' + fragmentName;
      this.fragments[id].close();
    },
    onFragmentHandler: async function _onFragmentHandler(oEvent, fragmentName, isDialog) {
      const id = this.getMainView().getId() + '--' + fragmentName;
      if (!!this.fragments[id] && !isDialog && this.fragments[id].isOpen()) {
        this.cancelFragment(oEvent, fragmentName);
      } else {
        const oButton = oEvent?.getSource();
        if (!this.fragments[id]) {
          const fragment = await Fragment.load({
            name: "icl.delivery.view.fragments." + fragmentName,
            controller: this
          });
          this.fragments[id] = fragment;
          this.getView().addDependent(this.fragments[id]);
        }
        isDialog ? this.fragments[id].open() : this.fragments[id].openBy(oButton, true);
      }
    },
    deleteRowFromList: function _deleteRowFromList(aList, deleteRow) {
      //generic function for all lists
      for (let i = 0; i < aList.length; i++) {
        if (aList[i] == deleteRow) {
          aList.splice(i, 1);
          break;
        }
      }
      delComponent.getModel("LocalModel").refresh();
    },
    loadIcons: function _loadIcons() {
      const aFonts = [{
        fontFamily: "SAP-icons-TNT",
        fontURI: sap.ui.require.toUrl("sap/tnt/themes/base/fonts/")
      }, {
        fontFamily: "BusinessSuiteInAppSymbols",
        fontURI: sap.ui.require.toUrl("sap/ushell/themes/base/fonts/")
      }];
      aFonts.forEach(oFont => {
        IconPool.registerFont(oFont);
      });
    },
    loadPersonalNumbers: function _loadPersonalNumbers(deliveryModel) {
      void fetch("/mockData/personalNumbers.JSON").then(res => res.json()).then(data => {
        deliveryModel.setProperty('/oData/personalNumbers', data);
      });
    },
    getDelivModel: function _getDelivModel() {
      const DelModel = delComponent.getModel("DelModel");
      return DelModel;
    },
    toggleFlag: function _toggleFlag(oEvent, modelPath) {
      const delivModel = this.getDelivModel();
      delivModel.setProperty(modelPath, !delivModel.getProperty(modelPath));
    },
    goBackHome: function _goBackHome() {
      // this.resetModel();
      this.navTo('main');
    },
    initTableSelections: function _initTableSelections(tableId) {
      const deliveryModel = this.getDelivModel();
      deliveryModel.setProperty('/oMaintain/share', {});
      const table = this.getView().byId(tableId);
      table.removeSelections(true);
      table.getBinding("items").filter(null);
      table.getBinding("items").sort(null);
    },
    sortTable: function _sortTable(oEvent, tableId) {
      const table = this.getView().byId(tableId),
        oBinding = table.getBinding("items"),
        sortBy = oEvent.getParameter('item').getKey(),
        sorters = [new Sorter(sortBy, false, false)];
      oBinding.sort(sorters);
    },
    reviewItem: function _reviewItem(oEvent, catNum) {
      const deliveryModel = this.getDelivModel();
      void fetch("/mockData/reviewItem.JSON").then(res => res.json()).then(data => {
        const review = data.find(review => review.catNum === catNum);
        deliveryModel.setProperty('/oData/itemReview', review);
      });
      void this.onFragmentHandler(oEvent, 'Dialog_ItemReview', true);
    },
    openNumsDialog: function _openNumsDialog(oEvent) {
      const deliveryModel = this.getDelivModel();
      const selItemToUpdate = oEvent.getSource().getBindingContext('DelModel').getPath();
      deliveryModel.setProperty('/oMaintain/share/selNumber', null);
      deliveryModel.setProperty('/oMaintain/share/itemPathForPesonalNum', selItemToUpdate);
      void this.onFragmentHandler(oEvent, 'Dialog_SelectNum', true);
    },
    onSelectNum: function _onSelectNum(oEvent) {
      const deliveryModel = this.getDelivModel();
      const selNumber = oEvent.getParameter('listItem').getBindingContext('DelModel').getObject();
      deliveryModel.setProperty('/oMaintain/share/selNumber', selNumber);
    },
    onSaveNum: function _onSaveNum(oEvent) {
      const deliveryModel = this.getDelivModel();
      const itemPath = deliveryModel.getProperty('/oMaintain/share/itemPathForPesonalNum');
      const selNumber = deliveryModel.getProperty('/oMaintain/share/selNumber');
      if (!selNumber) {
        MessageBox.error('לא בחרת שום מספר');
      } else {
        deliveryModel.setProperty(`${itemPath}/personalNum`, selNumber.presonalNum);
        void this.cancelFragment(oEvent, 'Dialog_SelectNum');
      }
    },
    onPrintDialog: function _onPrintDialog(oEvent) {
      void this.onFragmentHandler(oEvent, 'Dialog_Print', true);
    },
    disableComboBox: function _disableComboBox(comboId) {
      const oCombobox = this.getView().byId(comboId);
      if (oCombobox) oCombobox.addEventDelegate({
        onclick: () => {
          oCombobox.open();
        },
        onkeydown: e => {
          e.preventDefault();
        }
      });
    },
    requestReview: function _requestReview(oEvent, requestId) {
      const deliveryModel = this.getDelivModel();
      void fetch("/mockData/collectReview.JSON").then(res => res.json()).then(data => {
        const review = data.find(review => review.requestId === requestId);
        deliveryModel.setProperty('/oData/collectReview', review);
      });
      void this.onFragmentHandler(oEvent, 'PopOver_ReqReview');
    }
  });
  return BaseController;
});
//# sourceMappingURL=BaseController.js.map