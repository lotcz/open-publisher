import {NavigateFunction} from "react-router";
import GenericNavigator from "./GenericNavigator";
import PathProvider from "./PathProvider";

export default class LinkNavigator extends GenericNavigator {

	public provider: PathProvider;

	constructor(navigate: NavigateFunction, provider: PathProvider) {
		super(navigate);
		this.provider = provider;
	}

	path(): string {
		return this.provider.getPath();
	}

	go() {
		this.navigate(this.path());
	}

}
