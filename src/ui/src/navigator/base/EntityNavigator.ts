import {NavigateFunction} from "react-router";
import EntityPathProvider from "./EntityPathProvider";
import {PagingRequest} from "zavadil-ts-common";
import GenericNavigator from "./GenericNavigator";

export default class EntityNavigator extends GenericNavigator {

	public path: EntityPathProvider;

	constructor(navigate: NavigateFunction, pathProvider: EntityPathProvider) {
		super(navigate);
		this.path = pathProvider;
	}

	public add(param?: string | number) {
		this.navigate(this.path.add(param));
	}

	public detail(id?: number | null, replace?: boolean) {
		this.navigate(this.path.detail(id), replace ? {replace: true} : undefined);
	}

	public list(paging?: PagingRequest) {
		this.navigate(this.path.list(paging));
	}
}
