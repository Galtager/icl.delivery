sap.ui.define(["sap/ui/model/json/JSONModel", "sap/ui/Device", "sap/m/MessageBox", "sap/ui/model/Filter", "sap/ui/model/FilterOperator"], function (JSONModel, Device, MessageBox, Filter, FilterOperator) {
  var __exports = {
    createDeviceModel() {
      //TODO|ui5ts: generate constructors
      const oModel = new JSONModel(Device);
      oModel.setDefaultBindingMode("OneWay");
      return oModel;
    },
    handleErrors(errorMes, err) {
      try {
        MessageBox.error(JSON.stringify(errorMes));
      } catch (e) {
        MessageBox.error(JSON.stringify(e));
      }
      if (err || errorMes) console.log(err, errorMes);
    },
    QueryDataFromServer(filterParams, sService, sFunctionPath, sorters = [], expand) {
      try {
        const aFilters = Object.keys(filterParams).map(key => {
          return new Filter(key, FilterOperator.EQ, filterParams[key]);
        });
        let urlParameters = {};
        if (expand) urlParameters = {
          "$expand": expand
        };
        return new Promise(function (resolve, reject) {
          delComponent.getOdataModel(sService).read("/" + sFunctionPath, {
            filters: aFilters,
            sorters,
            urlParameters,
            success: ({
              results
            }) => {
              resolve(results);
            },
            error: error => {
              reject(error);
            }
          });
        });
      } catch (err) {
        console.log(err);
      }
    },
    ReadDataFromServer(oKeysParams, sService, sFunctionPath) {
      try {
        return delComponent.getOdataModel(sService).metadataLoaded().then(function () {
          const sKey = delComponent.getOdataModel(sService).createKey("/" + sFunctionPath, oKeysParams);
          return new Promise((resolve, reject) => {
            delComponent.getOdataModel(sService).read(sKey, {
              success: data => {
                resolve(data);
              },
              error: error => {
                reject(error);
              }
            });
          });
        });
      } catch (err) {
        console.log(err);
      }
    },
    CreateToServer(oKeysParams, sService, sFunctionPath) {
      try {
        return new Promise((resolve, reject) => {
          delComponent.getOdataModel(sService).create("/" + sFunctionPath, oKeysParams, {
            success: data => {
              resolve(data);
            },
            error: error => {
              reject(error);
            }
          });
        });
      } catch (err) {
        console.log(err);
      }
    },
    createJsonModel() {
      // Local Model for maintain the app 
      const oData = {
        oData: {},
        oMaintain: {
          // pages
          collectionList: {},
          collect: {},
          multiCollect: {},
          createReq: {},
          // share between pages
          share: {}
        },
        oFlags: {}
      };
      const oModel = new JSONModel(oData);
      return oModel;
    },
    createEmptyJsonModel() {
      // Local Model for maintain the app 
      const oData = {};
      const oModel = new JSONModel(oData);
      return oModel;
    }
  };
  return __exports;
});
//# sourceMappingURL=models.js.map