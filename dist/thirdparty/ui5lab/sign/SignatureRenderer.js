sap.ui.define([],function(){"use strict";var t={};t.render=function(t,r){t.write("<div");t.writeControlData(r);t.writeStyles();t.write(">");e(t,r);t.write("</div>")};function e(t,e){t.write("<svg");var r=e.getWidth()||"auto";var i=e.getHeight()||"auto";var o=e.getBackgroundColor();t.writeAttribute("width",r);t.writeAttribute("height",i);t.addStyle("background-color",o);t.writeStyles();t.write(">");t.write("</svg>")}return t},true);