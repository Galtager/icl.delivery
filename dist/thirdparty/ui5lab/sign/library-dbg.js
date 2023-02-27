/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable no-undef */

sap.ui.define(["jquery.sap.global", "sap/ui/core/library"], function (jQuery, library1) {
  "use strict";

  // load d3 as required library
  jQuery.sap.require("sap.ui.thirdparty.d3");
  sap.ui.getCore().initLibrary({
    name: "ui5.sign",
    dependencies: ["sap.ui.core"],
    types: [],
    interfaces: [],
    controls: ["ui5.sign.Signature"],
    elements: [],
    noLibraryCSS: false,
    version: "1.0.0"
  });
  return ui5.sign;
});
//# sourceMappingURL=library.js.map