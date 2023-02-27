import JSONModel from "sap/ui/model/json/JSONModel";
import Device from "sap/ui/Device";
import MessageBox from "sap/m/MessageBox";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import Sorter from "sap/ui/model/Sorter";

export default {
    createDeviceModel(): JSONModel {
        //TODO|ui5ts: generate constructors
        const oModel = new JSONModel(Device);
        oModel.setDefaultBindingMode("OneWay");
        return oModel;
    },
    handleErrors(errorMes: unknown, err?: string): void {
        try {
            MessageBox.error(JSON.stringify(errorMes));
        } catch (e) {
            MessageBox.error(JSON.stringify(e));
        }
        if (err || errorMes)
            console.log(err, errorMes);
    },
    QueryDataFromServer<T>(filterParams: Partial<T>, sService: string, sFunctionPath: string, sorters: Sorter[] = [], expand?: string): Promise<T[]> {
        try {
            const aFilters = Object.keys(filterParams).map((key) => {
                return new Filter(key, FilterOperator.EQ, filterParams[key as keyof typeof filterParams])
            })
            let urlParameters = {};
            if (expand) urlParameters = { "$expand": expand };
            return new Promise(function (resolve, reject) {
                delComponent.getOdataModel(sService).read("/" + sFunctionPath, {
                    filters: aFilters,
                    sorters,
                    urlParameters,
                    success: ({ results }: { results: T[] }) => {
                        resolve(results);
                    },
                    error: (error: unknown) => {
                        reject(error);
                    }
                },);
            });
        } catch (err) { console.log(err) }
    },
    ReadDataFromServer<T>(oKeysParams: Partial<T>, sService: string, sFunctionPath: string): Promise<T> {
        try {
            return delComponent.getOdataModel(sService).metadataLoaded().then(function () {
                const sKey = delComponent.getOdataModel(sService).createKey("/" + sFunctionPath, oKeysParams);
                return new Promise((resolve, reject) => {
                    delComponent.getOdataModel(sService).read(sKey, {
                        success: (data: T) => {
                            resolve(data);
                        },
                        error: (error: unknown) => {
                            reject(error);
                        }
                    });
                });

            })
        } catch (err) { console.log(err) }
    },
    CreateToServer<T>(oKeysParams: Partial<T>, sService: string, sFunctionPath: string): Promise<T> {
        try {
            return new Promise((resolve, reject) => {
                delComponent.getOdataModel(sService).create("/" + sFunctionPath, oKeysParams, {
                    success: (data: T) => {
                        resolve(data);
                    },
                    error: (error: unknown) => {
                        reject(error)
                    }
                });
            });
        } catch (err) { console.log(err) }
    },
    createJsonModel(): JSONModel {  // Local Model for maintain the app 
        const oData = {
            oData: {
            },
            oMaintain: {
                // pages
                collectionList: {},
                collect: {},
                multiCollect: {},
                createReq: {},
                // share between pages
                share: {}
            },
            oFlags: {
            }
        };
        const oModel = new JSONModel(oData);
        return oModel;
    },
    createEmptyJsonModel(): JSONModel {  // Local Model for maintain the app 
        const oData = {
        };
        const oModel = new JSONModel(oData);
        return oModel;
    },


};
