sap.ui.define(["sap/ui/core/UIComponent", "sap/ui/Device", "./model/models"], function (UIComponent, sap_ui_Device, __models) {
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const support = sap_ui_Device["support"];
  const models = _interopRequireDefault(__models);
  /**
   * @namespace icl.delivery
   */
  const Component = UIComponent.extend("icl.delivery.Component", {
    metadata: {
      manifest: "json"
    },
    init: function _init() {
      globalThis.delComponent = this;
      this.setModel(models.createJsonModel(), "DelModel");
      const DelModel = this.getModel('DelModel');
      DelModel.setSizeLimit(1000);

      // call the base component's init function
      UIComponent.prototype.init.call(this);

      // create the views based on the url/hash
      this.getRouter().initialize();
    },
    getContentDensityClass: function _getContentDensityClass() {
      if (this.contentDensityClass === undefined) {
        // check whether FLP has already set the content density class; do nothing in this case
        if (document.body.classList.contains("sapUiSizeCozy") || document.body.classList.contains("sapUiSizeCompact")) {
          this.contentDensityClass = "";
        } else if (!support.touch) {
          // apply "compact" mode if touch is not supported
          this.contentDensityClass = "sapUiSizeCompact";
        } else {
          // "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
          this.contentDensityClass = "sapUiSizeCozy";
        }
      }
      return this.contentDensityClass;
    },
    i18n: function _i18n(str) {
      const i18n = this.getModel("i18n");
      const translation = i18n.getProperty(str);
      return translation;
    },
    getOdataModel: function _getOdataModel(sName) {
      return UIComponent.prototype.getModel.call(this, sName);
    }
  });
  return Component;
});
//# sourceMappingURL=Component.js.map