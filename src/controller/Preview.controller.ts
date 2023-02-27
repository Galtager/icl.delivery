import UIComponent from "sap/ui/core/UIComponent";
import BaseController from "./BaseController";
import Event from "sap/ui/base/Event";
import { ICollectRequest } from "./Main.controller";

/**
 * @namespace icl.delivery.controller
 */
export default class Preview extends BaseController {
    onInit() {
        super.onInit();
        const oRouter = UIComponent.getRouterFor(this);
        // eslint-disable-next-line @typescript-eslint/unbound-method
        oRouter.getRoute("preview").attachMatched(this._initialFunc, this);
    }
    public _initialFunc() {
        const deliveryModel = this.getDelivModel();
        deliveryModel.setProperty('/currView', 'preview');
        deliveryModel.setProperty('/oMaintain/previewAccept', false)
    }
    checkSelected(oEvent: Event) {
        const deliveryModel = this.getDelivModel();

        if (oEvent.getParameter('selected')) {
            // check there is some selected
            const items = deliveryModel.getProperty('/oMaintain/multiCollect/previewItems') as ICollectRequest[];
            const allSelected = items.every(item => item.acceptCollect);
            deliveryModel.setProperty('/oMaintain/previewAccept', allSelected)
        }
        else {
            deliveryModel.setProperty('/oMaintain/previewAccept', false)
        }
    }
    public onPrintFinish(oEvent: Event) {
        // lock the screen and show after collect state
        this.cancelFragment(oEvent, 'Dialog_FinishMulti')
        void this.onFragmentHandler(oEvent, 'Dialog_Print', true)

    }
    finishMulti(oEvent: Event) {
        void this.onFragmentHandler(oEvent, 'Dialog_FinishMulti', true)
    }
}