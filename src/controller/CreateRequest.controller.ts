import BaseController from "./BaseController";
import UIComponent from "sap/ui/core/UIComponent";
import Event from "sap/ui/base/Event";
import { ICollectItem } from "./MultiCollect.controller";
import ListItem from "sap/ui/core/ListItem";
import { ICollectRequest } from "./Main.controller";
import Table from "sap/m/Table";
import ListBinding from "sap/ui/model/ListBinding";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";

/**
 * @namespace icl.delivery.controller
 */
export default class CreateRequest extends BaseController {
    onInit() {
        super.onInit();
        const oRouter = UIComponent.getRouterFor(this);
        // eslint-disable-next-line @typescript-eslint/unbound-method
        oRouter.getRoute("createRequest").attachMatched(this._initialFunc, this);
    }
    public _initialFunc() {
        this.initTableSelections('createReqItems')
        const deliveryModel = this.getDelivModel();
        deliveryModel.setProperty('/oFlags/headerNavBack', true);
        deliveryModel.setProperty('/currView', 'createRequest');
        deliveryModel.setProperty('/oMaintain/createReq', { step: '1' });

    }
    public searchArmor(oEvent: Event) {
        const query = oEvent.getParameter('query') as string
        const deliveryModel = this.getDelivModel();
        void fetch("/mockData/collectItems.JSON")
            .then(res => res.json())
            .then((data: ICollectItem[]) => {
                const filterItems = data.filter(item => item.armorId === query);
                deliveryModel.setProperty('/oMaintain/createReq/armorSel', filterItems.length ? query : '');
                deliveryModel.setProperty('/oData/armorItems', filterItems.length ? filterItems : []);

            });

    }
    public checked(oEvent: Event) {
        const deliveryModel = this.getDelivModel();
        const li = oEvent.getParameter('listItem') as ListItem;
        const checked = oEvent.getParameter('selected') as boolean;
        const itemPath = li.getBindingContext('DelModel').getPath();
        deliveryModel.setProperty(`${itemPath}/selected`, checked)
        if (checked)
            deliveryModel.setProperty('/oMaintain/createReq/continue', checked)
        else {
            // check how many selected
            const items = deliveryModel.getProperty('/oData/armorItems') as ICollectItem[];
            const atLeastOne = items.some(item => item.selected);
            deliveryModel.setProperty('/oMaintain/createReq/continue', atLeastOne)
        }
    }

    public cancelArmor() {
        const deliveryModel = this.getDelivModel();
        this.onNavBack()
        deliveryModel.setProperty('/oData/armorItems', []);
    }
    public preview() {
        this.filterTable(new Filter('selected', FilterOperator.EQ, true));
        this.setStep('2')
    }
    public backToEdit() {
        this.filterTable(null);
        this.setStep('1')
    }
    private filterTable(filter: Filter | null) {
        const table = this.getView().byId('createReqItems') as Table,
            oBinding = table.getBinding("items") as ListBinding;
        oBinding.filter(filter);
    }
    private setStep(step: '1' | '2') {
        const deliveryModel = this.getDelivModel();
        deliveryModel.setProperty('/oMaintain/createReq/step', step);

    }
}