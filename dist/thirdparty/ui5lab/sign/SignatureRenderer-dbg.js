/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable no-undef */

sap.ui.define([], function () {
  "use strict";

  var oSignatureRenderer = {};
  oSignatureRenderer.render = function (oRm, oControl) {
    // get control properties

    oRm.write("<div");
    oRm.writeControlData(oControl);
    oRm.writeStyles();
    oRm.write(">");
    _createSVG(oRm, oControl);
    oRm.write("</div>");
  };
  function _createSVG(oRm, oControl) {
    oRm.write("<svg");
    var sWidth = oControl.getWidth() || "auto";
    var sHeight = oControl.getHeight() || "auto";
    var sBackgroundColor = oControl.getBackgroundColor();
    oRm.writeAttribute("width", sWidth);
    oRm.writeAttribute("height", sHeight);
    oRm.addStyle("background-color", sBackgroundColor);
    oRm.writeStyles();
    oRm.write(">");
    oRm.write("</svg>");
  }
  return oSignatureRenderer;
}, /* bExport= */true);
//# sourceMappingURL=SignatureRenderer.js.map