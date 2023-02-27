
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
import VBox from "sap/m/VBox";
import { ICollectRequest } from "./Main.controller";


/**
 * @namespace icl.delivery.controller
 */
export default class Collect extends BaseController {
    onAfterRendering() {
        this.disableComboBox('noWriteCombo2')
    }
    onInit() {
        super.onInit();
        const oRouter = UIComponent.getRouterFor(this);
        // eslint-disable-next-line @typescript-eslint/unbound-method
        oRouter.getRoute("collect").attachMatched(this._initialFunc, this);
    }
    public _initialFunc() {
        this.initTableSelections('itemsTable')
        const deliveryModel = this.getDelivModel();
        deliveryModel.setProperty('/oMaintain/title', delComponent.i18n('collectFrom'));
        deliveryModel.setProperty('/oFlags/headerNavBack', true);
        deliveryModel.setProperty('/currView', 'collect');

        const currCollect = deliveryModel.getProperty('/oMaintain/collect/currCollect') as ICollectRequest
        if (currCollect) {
            this.loadItems(deliveryModel);
        } else this.onNavBack()
    }
    public loadItems(deliveryModel: JSONModel) {
        void fetch("/mockData/collectItems.JSON")
            .then(res => res.json())
            .then((data) => {
                deliveryModel.setProperty('/oData/collectItems', data);
            });
    }
    public filterItems(oEvent: Event) {
        const searchValue = oEvent.getParameter('newValue') as string,
            table = this.getView().byId('itemsTable') as Table,
            oBinding = table.getBinding("items") as ListBinding,
            filters: Filter[] = [new Filter('catNum', FilterOperator.Contains, searchValue)];
        oBinding.filter(searchValue ? filters : null);
    }
    public onStartCollectDialog(oEvent: Event) {
        const deliveryModel = this.getDelivModel();

        // check if have error before start -- need to fetch server
        deliveryModel.setProperty('/oMaintain/collect/startError', 'הפק"ע סגורה');

        void this.onFragmentHandler(oEvent, 'Dialog_StartCollect', true)

    }
    public startCollect(oEvent: Event) {
        const deliveryModel = this.getDelivModel();
        deliveryModel.setProperty('/oMaintain/share/showStartDialog', true);
        deliveryModel.setProperty('/oMaintain/collect/start', true);
        setTimeout(() => {
            void this.cancelFragment(oEvent, 'Dialog_StartCollect')

        }, 1500)

    }
    public showBlob() {
        alert('show blob as url')
    }
    public onFinishCollect(oEvent: Event) {
        const deliveryModel = this.getDelivModel();
        const table = this.getView().byId('itemsTable') as Table;
        if (table.getItems().length === table.getSelectedItems().length) {
            deliveryModel.setProperty('/oMaintain/collect/endCollect', { materialNum: '123456777' });
            // send post request to sap then get response for material number
            void this.onFragmentHandler(oEvent, 'Dialog_FinishCollect', true)
        }
        else
            MessageBox.show('לא סימנת את כל הפריטים')
    }
    public onPrintFinish(oEvent: Event) {
        const deliveryModel = this.getDelivModel();
        // lock the screen and show after collect state
        deliveryModel.setProperty('/oMaintain/collect/endCollect/finish', true);
        deliveryModel.setProperty('/oMaintain/collect/start', false);
        void this.cancelFragment(oEvent, 'Dialog_FinishCollect')
    }
    public async onDigitalSignDialog(oEvent: Event) {
        await this.onFragmentHandler(oEvent, 'Dialog_DigitSign', true)
        this.cleanSign();
        this.attachSignEvent()

    }
    private attachSignEvent() {
        const vbox = sap.ui.getCore().byId('signaturePad') as VBox;
        const signaturePad = vbox.getItems()[0];
        signaturePad.attachBrowserEvent('click', () => {
            const deliveryModel = this.getDelivModel();
            deliveryModel.setProperty('/oMaintain/collect/sign', true)
        })
    }
    private cleanSign() {
        const deliveryModel = this.getDelivModel();
        deliveryModel.setProperty('/oMaintain/countedForm/signature', true)
        const VBox = sap.ui.getCore().byId('signaturePad') as VBox;
        const signaturePad: any = VBox.getItems()[0];
        signaturePad.clear();
        deliveryModel.setProperty('/oMaintain/collect/sign', false)

    }
    public deleteReq(oEvent: Event) {
        this.cancelFragment(oEvent, 'Dialog_DeleteReq');
        this.navTo('main')
    }

}