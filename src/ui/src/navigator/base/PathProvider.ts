import {StringUtil} from "zavadil-ts-common";

export default class PathProvider {

	protected parent?: PathProvider;

	protected path: string;

	constructor(path: string, parent?: PathProvider) {
		this.parent = parent;
		this.path = path;
	}

	public getPath(path?: string): string {
		const parts = [this.parent?.getPath(), this.path, path].filter((s) => StringUtil.notBlank(s));
		return parts.join('/');
	}

}
