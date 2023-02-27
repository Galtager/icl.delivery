/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import UIComponent from "sap/ui/core/UIComponent";
import BaseController from "./BaseController";
import JSONModel from "sap/ui/model/json/JSONModel";
import Event from "sap/ui/base/Event";
import Table from "sap/m/Table";
import ListBinding from "sap/ui/model/ListBinding";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import MessageBox from "sap/m/MessageBox";
import { IAccessType, ICollectRequest } from "./Main.controller";


export type ICollectItem = {
    reqNumber?: number
    num: string
    requestId: string
    catNum: string
    desc: string
    unit: string
    amount: string
    invAmount: string
    locat: string
    sortNum: string
    accessType: IAccessType
    isMochlol: boolean,
    isDanger: boolean
    armorId: string
    selected?: boolean

}

/**
 * @namespace icl.delivery.controller
 */
export default class MultiCollect extends BaseController {
    onAfterRendering() {
        this.disableComboBox('noWriteCombo3')
    }

    onInit() {
        super.onInit();
        const oRouter = UIComponent.getRouterFor(this);
        // eslint-disable-next-line @typescript-eslint/unbound-method
        oRouter.getRoute("multiCollect").attachMatched(this._initialFunc, this);
    }
    public _initialFunc() {

        this.initTableSelections('multiItemsTable');

        const deliveryModel = this.getDelivModel();
        deliveryModel.setProperty('/oFlags/headerNavBack', true);
        deliveryModel.setProperty('/currView', 'multiCollect');
        const collects = this.loadCollects(deliveryModel);
        if (!collects.length) { this.onNavBack() }
        deliveryModel.setProperty('/oMaintain/multiCollect/collectFilter', collects.map(col => col.reqNumber));

        void this.loadItems(deliveryModel, collects);
    }
    async loadItems(deliveryModel: JSONModel, collects: ICollectRequest[]) {
        const allItems: ICollectItem[] = []
        // fetch all selected collects items
        for (let i = 0; i < collects.length; i++) {
            await fetch("/mockData/collectItems.JSON")
                .then(res => res.json())
                .then((data: ICollectItem[]) => {
                    const items = data.filter(item => {
                        if (item.requestId === collects[i].requestId) {
                            item.reqNumber = collects[i].reqNumber;
                            return true;
                        }
                        return false;
                    });
                    allItems.push(...items)
                });

        }
        deliveryModel.setProperty('/oData/multiCollectItems', allItems);
    }
    loadCollects(deliveryModel: JSONModel) {
        const collectsList = deliveryModel.getProperty('/oData/collectList') as ICollectRequest[];
        if (collectsList) {
            const selCollects = collectsList.filter(coll => coll.selected);
            selCollects.map((el, i) => el.reqNumber = i + 1)
            deliveryModel.setProperty('/oMaintain/multiCollect/currCollects', selCollects);
            return selCollects
        }
        return []
    }
    public onStartCollectDialog(oEvent: Event) {
        const deliveryModel = this.getDelivModel();
        // check if have error before start -- need to fetch server
        deliveryModel.setProperty('/oMaintain/share/showStartDialog', true);
        void this.onFragmentHandler(oEvent, 'Dialog_StartCollect', true)
        deliveryModel.setProperty('/oMaintain/multiCollect/start', true);
        setTimeout(() => {
            void this.cancelFragment(oEvent, 'Dialog_StartCollect')
        }, 1500)
    }
    public filter() {
        const deliveryModel = this.getDelivModel(),
            table = this.getView().byId('multiItemsTable') as Table,
            oBinding = table.getBinding("items") as ListBinding,
            filters: Filter[] = [];
        const collectFilters = deliveryModel.getProperty('/oMaintain/multiCollect/collectFilter') as string[]
        const searchFilter = deliveryModel.getProperty('/oMaintain/multiCollect/searchFilter') as string

        // search filters
        searchFilter && filters.push(new Filter('catNum', FilterOperator.Contains, searchFilter))
        // collect filters
        const collectOrFilters = collectFilters.map(collectFilter => new Filter('reqNumber', FilterOperator.EQ, collectFilter));
        collectOrFilters.length && filters.push(new Filter({ filters: collectOrFilters, and: false }))
        oBinding.filter(filters)

    }
    public onFinishCollects(oEvent: Event) {
        const table = this.getView().byId('multiItemsTable') as Table;
        if (table.getItems().length === table.getSelectedItems().length) {
            this.navTo('preview');
            this.groupByCollectReq()

        }
        else
            MessageBox.show('לא סימנת את כל הפריטים')
    }
    private groupByCollectReq() {
        const deliveryModel = this.getDelivModel();
        const selCollects = deliveryModel.getProperty('/oMaintain/multiCollect/currCollects') as ICollectRequest[];
        const collectsItems = deliveryModel.getProperty('/oData/multiCollectItems') as ICollectItem[];
        const groupedCollects = selCollects.map(collect => {
            const collectItems = collectsItems.filter(item => item.reqNumber === collect.reqNumber)
            collect.items = collectItems;
            return collect;
        })
        deliveryModel.setProperty('/oMaintain/multiCollect/previewItems', groupedCollects)
        console.log(groupedCollects)
    }


}