sap.ui.define(["./BaseController","sap/ui/core/UIComponent","sap/ui/model/Filter","sap/ui/model/FilterOperator"],function(e,t,o,n){function i(e){return e&&e.__esModule&&typeof e.default!=="undefined"?e.default:e}const r=i(e);const s=r.extend("icl.delivery.controller.CreateRequest",{onInit:function e(){r.prototype.onInit.call(this);const o=t.getRouterFor(this);o.getRoute("createRequest").attachMatched(this._initialFunc,this)},_initialFunc:function e(){this.initTableSelections("createReqItems");const t=this.getDelivModel();t.setProperty("/oFlags/headerNavBack",true);t.setProperty("/currView","createRequest");t.setProperty("/oMaintain/createReq",{step:"1"})},searchArmor:function e(t){const o=t.getParameter("query");const n=this.getDelivModel();void fetch("/mockData/collectItems.JSON").then(e=>e.json()).then(e=>{const t=e.filter(e=>e.armorId===o);n.setProperty("/oMaintain/createReq/armorSel",t.length?o:"");n.setProperty("/oData/armorItems",t.length?t:[])})},checked:function e(t){const o=this.getDelivModel();const n=t.getParameter("listItem");const i=t.getParameter("selected");const r=n.getBindingContext("DelModel").getPath();o.setProperty(`${r}/selected`,i);if(i)o.setProperty("/oMaintain/createReq/continue",i);else{const e=o.getProperty("/oData/armorItems");const t=e.some(e=>e.selected);o.setProperty("/oMaintain/createReq/continue",t)}},cancelArmor:function e(){const t=this.getDelivModel();this.onNavBack();t.setProperty("/oData/armorItems",[])},preview:function e(){this.filterTable(new o("selected",n.EQ,true));this.setStep("2")},backToEdit:function e(){this.filterTable(null);this.setStep("1")},filterTable:function e(t){const o=this.getView().byId("createReqItems"),n=o.getBinding("items");n.filter(t)},setStep:function e(t){const o=this.getDelivModel();o.setProperty("/oMaintain/createReq/step",t)}});return s});