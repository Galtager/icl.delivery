import AppComponent from "../Component";
import JSONModel from "sap/ui/model/json/JSONModel";

import Controller from "sap/ui/core/mvc/Controller";
import UIComponent from "sap/ui/core/UIComponent";
import Router from "sap/ui/core/routing/Router";
import formatter from "../model/formatter";
import Event from "sap/ui/base/Event";
import Fragment from "sap/ui/core/Fragment";
import UI5Element from "sap/ui/core/Element";
import View from "sap/ui/core/mvc/View";
import Popover from "sap/m/Popover";
import Dialog from "sap/m/Dialog";
import IconPool from "sap/ui/core/IconPool";
import Control from "sap/ui/core/Control";
import Table from "sap/m/Table";
import ListItem from "sap/ui/core/ListItem";
import ListBinding from "sap/ui/model/ListBinding";
import Sorter from "sap/ui/model/Sorter";
import SegmentedButtonItem from "sap/m/SegmentedButtonItem";
import MessageBox from "sap/m/MessageBox";
import MultiComboBox from "sap/m/MultiComboBox";

type IReviewItem = {
	catNum: string
	longDesc: string
	unit: string
	stockAmount: string
	storage: string
	location: string
	files: IFile[]
}
type IFile = {
	name: string
	type: string
	date: string
	blob: string

}
type IPersonalNumber = {
	catNum: string
	presonalNum: string
}
type IReview = {
	requestId: string
	jobOrder: string
	orderType: string
	armorId: string
	shortText: string
	date: string
	funcLoact: string
	reqSite: string
	delivPt: string
	priority: string

}


/**
 * @namespace icl.delivery.controller
 */
export default abstract class BaseController extends Controller {
	protected viewController: Controller;
	private firstRun = true;

	public formatter = formatter;
	public fragments: {
		[key: string]: Popover | Dialog;
	} = {};


	onInit() {
		const deliveryModel = this.getDelivModel();
		// run only 
		if (this.firstRun) {
			this.firstRun = false;
			this.loadIcons();
			this.loadUser(deliveryModel);
			this.loadSections(deliveryModel)
			this.loadSites(deliveryModel)
			this.loadTypes(deliveryModel);
			this.loadPersonalNumbers(deliveryModel)
			this.loadPrinters(deliveryModel)
		}
	}
	loadTypes(deliveryModel: JSONModel) {
		void fetch("/mockData/types.JSON")
			.then(res => res.json())
			.then(data => deliveryModel.setProperty('/oData/types', data))
	}
	private loadUser(deliveryModel: JSONModel) {
		deliveryModel.setProperty('/user', {
			name: 'יורם אלקובי',
			contactName: 'יוסי אבוקסיס',
			tel: '0549080187',
			site: '12',
			sections: ['3', '10'],
			sectionsNames: ['חשמל 3', 'אינוונטר 17']
		})
	}
	private loadSections(deliveryModel: JSONModel) {
		void fetch("/mockData/sections.JSON")
			.then(res => res.json())
			.then(data => deliveryModel.setProperty('/oData/sections', data))

	}
	private loadSites(deliveryModel: JSONModel) {
		void fetch("/mockData/sites.JSON")
			.then(res => res.json())
			.then(data => deliveryModel.setProperty('/oData/sites', data))

	}
	loadPrinters(deliveryModel: JSONModel) {
		void fetch("/mockData/printers.JSON")
			.then(res => res.json())
			.then((data) => {
				deliveryModel.setProperty('/oData/printers', data);
			});
	}

	public getOwnerComponent(): AppComponent {
		return (super.getOwnerComponent() as AppComponent);
	}
	public getRouter(): Router {
		return UIComponent.getRouterFor(this);
	}
	public navTo(sName: string, oParameters?: object, bReplace?: boolean): void {
		this.getRouter().navTo(sName, oParameters, undefined, bReplace);
	}
	public onNavBack(): void {
		window.history.go(-1);
	}
	private getMainView(): View {
		return this.getView() || this.viewController.getView();
	}
	public cancelFragment(oEvent: Event, fragmentName: string) {
		const id = this.getMainView().getId() + '--' + fragmentName;
		this.fragments[id].close();
	}
	public async onFragmentHandler(oEvent: Event, fragmentName: string, isDialog?: boolean): Promise<void> {
		const id = this.getMainView().getId() + '--' + fragmentName;
		if (!!this.fragments[id] && !isDialog && this.fragments[id].isOpen()) {
			this.cancelFragment(oEvent, fragmentName);
		}
		else {
			const oButton = oEvent?.getSource() as Control;
			if (!this.fragments[id]) {
				const fragment = await Fragment.load({ name: "icl.delivery.view.fragments." + fragmentName, controller: this });
				this.fragments[id] = fragment as Dialog
				this.getView().addDependent(this.fragments[id] as UI5Element);
			}
			isDialog ? (this.fragments[id] as Dialog).open() : (this.fragments[id] as Popover).openBy(oButton, true);
		}
	}
	public deleteRowFromList<T>(aList: T[], deleteRow: T) { //generic function for all lists
		for (let i = 0; i < aList.length; i++) {
			if (aList[i] == deleteRow) {
				aList.splice(i, 1);
				break;
			}
		}
		delComponent.getModel("LocalModel").refresh();
	}
	private loadIcons() {
		const aFonts = [
			{
				fontFamily: "SAP-icons-TNT",
				fontURI: sap.ui.require.toUrl("sap/tnt/themes/base/fonts/")
			},
			{
				fontFamily: "BusinessSuiteInAppSymbols",
				fontURI: sap.ui.require.toUrl("sap/ushell/themes/base/fonts/")
			}
		];

		aFonts.forEach(oFont => {
			IconPool.registerFont(oFont);
		});

	}
	private loadPersonalNumbers(deliveryModel: JSONModel) {
		void fetch("/mockData/personalNumbers.JSON")
			.then(res => res.json())
			.then((data) => {
				deliveryModel.setProperty('/oData/personalNumbers', data);
			});

	}
	public getDelivModel() {
		const DelModel = delComponent.getModel("DelModel") as JSONModel;
		return DelModel;
	}
	public toggleFlag(oEvent: Event | null, modelPath: string) {
		const delivModel = this.getDelivModel();
		delivModel.setProperty(modelPath, !delivModel.getProperty(modelPath));
	}
	private goBackHome() {
		// this.resetModel();
		this.navTo('main');
	}
	public initTableSelections(tableId: string) {
		const deliveryModel = this.getDelivModel();
		deliveryModel.setProperty('/oMaintain/share', {})
		const table = this.getView().byId(tableId) as Table;
		table.removeSelections(true);
		(table.getBinding("items") as ListBinding).filter(null);
		(table.getBinding("items") as ListBinding).sort(null);
	}
	public sortTable(oEvent: Event, tableId: string) {
		const table = this.getView().byId(tableId) as Table,
			oBinding = table.getBinding("items") as ListBinding,
			sortBy = (oEvent.getParameter('item') as SegmentedButtonItem).getKey(),
			sorters: Sorter[] = [new Sorter(sortBy, false, false)];
		oBinding.sort(sorters);
	}
	public reviewItem(oEvent: Event, catNum: string) {
		const deliveryModel = this.getDelivModel();
		void fetch("/mockData/reviewItem.JSON")
			.then(res => res.json())
			.then((data: IReviewItem[]) => {
				const review = data.find(review => review.catNum === catNum);
				deliveryModel.setProperty('/oData/itemReview', review);
			});
		void this.onFragmentHandler(oEvent, 'Dialog_ItemReview', true)

	}
	public openNumsDialog(oEvent: Event) {
		const deliveryModel = this.getDelivModel();
		const selItemToUpdate = (oEvent.getSource() as ListItem).getBindingContext('DelModel').getPath()
		deliveryModel.setProperty('/oMaintain/share/selNumber', null)
		deliveryModel.setProperty('/oMaintain/share/itemPathForPesonalNum', selItemToUpdate)
		void this.onFragmentHandler(oEvent, 'Dialog_SelectNum', true)
	}
	public onSelectNum(oEvent: Event) {
		const deliveryModel = this.getDelivModel();
		const selNumber = (oEvent.getParameter('listItem') as ListItem).getBindingContext('DelModel').getObject() as IPersonalNumber;
		deliveryModel.setProperty('/oMaintain/share/selNumber', selNumber)
	}
	public onSaveNum(oEvent: Event) {
		const deliveryModel = this.getDelivModel();
		const itemPath = deliveryModel.getProperty('/oMaintain/share/itemPathForPesonalNum') as string
		const selNumber = deliveryModel.getProperty('/oMaintain/share/selNumber') as IPersonalNumber;

		if (!selNumber) { MessageBox.error('לא בחרת שום מספר') }
		else {
			deliveryModel.setProperty(`${itemPath}/personalNum`, selNumber.presonalNum)
			void this.cancelFragment(oEvent, 'Dialog_SelectNum')

		}
	}
	public onPrintDialog(oEvent: Event) {
		void this.onFragmentHandler(oEvent, 'Dialog_Print', true)
	}
	public disableComboBox(comboId: string) {
		const oCombobox = this.getView().byId(comboId) as MultiComboBox;
		if (oCombobox)
			oCombobox.addEventDelegate({
				onclick: () => {
					oCombobox.open();
				},
				onkeydown: (e: Event) => {
					e.preventDefault();
				},
			});
	}
	public requestReview(oEvent: Event, requestId: string) {
		const deliveryModel = this.getDelivModel();
		void fetch("/mockData/collectReview.JSON")
			.then(res => res.json())
			.then((data: IReview[]) => {
				const review = data.find(review => review.requestId === requestId);
				deliveryModel.setProperty('/oData/collectReview', review);
			});

		void this.onFragmentHandler(oEvent, 'PopOver_ReqReview')
	}

}
