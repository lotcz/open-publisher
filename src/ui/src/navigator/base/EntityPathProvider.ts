import {PagingRequest, PagingUtil} from "zavadil-ts-common";
import PathProvider from "./PathProvider";

export default class EntityPathProvider extends PathProvider {

	public add(param?: string | number): string {
		return this.getPath(param ? `detail/vlozit/${param}` : 'detail/vlozit');
	}

	public detail(id?: number | null): string {
		return id ? this.getPath(`detail/${id}`) : this.add();
	}

	public list(paging?: PagingRequest): string {
		const path = this.getPath();
		if (!paging) return path;
		const params = PagingUtil.pagingRequestToString(paging);
		return `${path}/${params}`;
	}

}
