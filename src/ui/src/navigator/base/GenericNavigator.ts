import {NavigateFunction} from "react-router";

export default class GenericNavigator {

	public navigate: NavigateFunction;

	constructor(navigate: NavigateFunction) {
		this.navigate = navigate;
	}

}
