import UIComponent from "sap/ui/core/UIComponent";
import BaseController from "./BaseController";
import JSONModel from "sap/ui/model/json/JSONModel";
import Event from "sap/ui/base/Event";
import MultiComboBox from "sap/m/MultiComboBox";
import ListItem from "sap/ui/core/ListItem";
import List from "sap/m/List";
import ListBinding from "sap/ui/model/ListBinding";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import { ICollectItem } from "./MultiCollect.controller";

export type IType = "argunt" | 'timing' | 'delivery'
export type IAccessType = "forklift" | 'normal' | 'melaket' | 'ladder'
export type ICollectRequest = {
	status: string
	statusDesc: string,
	requestId: string
	type: IType,
	armorId: string
	date: string
	time: string
	amount: string
	askName: string
	factory: string
	accessType: IAccessType
	site: string
	section: string
	reqNumber?: number
	selected?: boolean
	items?: ICollectItem[]
	acceptCollect?: boolean

}
type IStatusFilter = {
	status: string
	statusDesc: string,
	count: number
}
type ITypeFilter = {
	type: string
	count: number
	selected?: boolean
}
type IFilters = {
	searchFilter: string,
	statusFilter: string,
	groupByType: ITypeFilter[]
}

/**
 * @namespace icl.delivery.controller
 */
export default class Main extends BaseController {

	onAfterRendering() {
		this.disableComboBox('noWriteCombo')
	}
	onInit() {
		super.onInit();
		const oRouter = UIComponent.getRouterFor(this);
		// eslint-disable-next-line @typescript-eslint/unbound-method
		oRouter.getRoute("main").attachMatched(this._initialFunc, this);
	}
	private _initialFunc() {

		this.initTableSelections('collectList')
		const deliveryModel = this.getDelivModel();
		deliveryModel.setProperty('/oMaintain/title', delComponent.i18n('main_title'));
		deliveryModel.setProperty('/oFlags/headerNavBack', false);
		deliveryModel.setProperty('/currView', 'main');
		deliveryModel.setProperty('/currView', 'main');

		this.loadCollectList(deliveryModel)
	}
	public loadCollectList(deliveryModel: JSONModel) {
		void fetch("/mockData/CollectList.JSON")
			.then(res => res.json())
			.then((data: ICollectRequest[]) => {
				const { statsArray, typesArray } = this.groupBy(data)
				deliveryModel.setProperty('/oMaintain/collectionList', { groupByStatus: statsArray, groupByType: typesArray })
				deliveryModel.setProperty('/oData/collectList', data);
			});
	}
	// create the status and type filters from the list
	public groupBy(data: ICollectRequest[]) {
		const statuses: { [key: string]: IStatusFilter } = {}
		const typees: { [key: string]: ITypeFilter } = {}
		data.map(req => {
			const { status, statusDesc, type } = req
			//group statuses
			if (!statuses[status])
				statuses[status] = { status, statusDesc, count: 1 }
			else
				statuses[status].count += 1;
			//group types
			if (!typees[type])
				typees[type] = { type, count: 1 }
			else
				typees[type].count += 1;

		})
		const statsArray = Object.keys(statuses).map(el => statuses[el])
		const typesArray = Object.keys(typees).map(el => typees[el])
		statsArray.unshift({ 'count': data.length, status: '99', statusDesc: delComponent.i18n('all') });
		return { statsArray, typesArray };
	}
	public checked(oEvent: Event) {
		const deliveryModel = this.getDelivModel();
		const li = oEvent.getParameter('listItem') as ListItem;
		const checked = oEvent.getParameter('selected') as boolean;
		const itemPath = li.getBindingContext('DelModel').getPath();
		deliveryModel.setProperty(`${itemPath}/selected`, checked)

		// check how many selected
		const items = deliveryModel.getProperty('/oData/collectList') as ICollectRequest[];
		const atLeastOne = items.filter(item => item.selected);
		deliveryModel.setProperty('/oMaintain/collectionList/showListFooter', atLeastOne.length)
	}
	public filter() {
		const deliveryModel = this.getDelivModel(),
			list = this.getView().byId('collectList') as List,
			oBinding = list.getBinding("items") as ListBinding,
			filters: Filter[] = [];

		const { statusFilter, searchFilter, groupByType } = deliveryModel.getProperty('/oMaintain/collectionList') as IFilters

		// search filters
		searchFilter && filters.push(this.getSerachFilter(searchFilter))
		// type filters
		const typeFilters = this.getTypeFilter(groupByType)
		typeFilters && filters.push(typeFilters)
		// status filter
		// not 'all' choic then filter
		if (statusFilter && statusFilter !== '99') {
			filters.push(new Filter("status", FilterOperator.Contains, statusFilter))

		}
		oBinding.filter(filters)

	}
	private getSerachFilter(searchValue: string) {
		const searchFilters = new Filter(
			{
				filters: [
					new Filter("requestId", FilterOperator.Contains, searchValue),
					new Filter("armorId", FilterOperator.Contains, searchValue),
					new Filter("askName", FilterOperator.Contains, searchValue),
				],
				and: false
			});
		return searchFilters;

	}
	private getTypeFilter(options: ITypeFilter[]) {
		const typeFilters: Filter[] = []
		options.map(type => {
			if (type.selected) {
				typeFilters.push(new Filter("type", FilterOperator.Contains, type.type))
			}
		})
		if (typeFilters.length) {
			return new Filter({ filters: typeFilters, and: false });
		}
		return null;


	}
	navToCollect(oEvent: Event) {
		const deliveryModel = this.getDelivModel();
		const collectReq = (oEvent.getSource() as ListItem).getBindingContext('DelModel').getObject() as ICollectRequest;
		// init collect page model
		deliveryModel.setProperty('/oMaintain/collect', { currCollect: collectReq });

		this.navTo('collect')
	}
	navToMultiCollect(oEvent: Event) {
		const deliveryModel = this.getDelivModel();
		deliveryModel.setProperty('/oMaintain/multiCollect', {});
		this.navTo('multiCollect')
	}

}
