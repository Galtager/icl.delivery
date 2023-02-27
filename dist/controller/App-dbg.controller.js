sap.ui.define(["./BaseController"], function (__BaseController) {
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const BaseController = _interopRequireDefault(__BaseController);
  /**
   * @namespace icl.delivery.controller
   */
  const App = BaseController.extend("icl.delivery.controller.App", {
    onInit: function _onInit() {
      // apply content density mode to root view
    }
  });
  return App;
});
//# sourceMappingURL=App.controller.js.map