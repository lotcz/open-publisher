import {NavigateFunction} from "react-router";
import LinkNavigator from "./base/LinkNavigator";
import EntityNavigator from "./base/EntityNavigator";
import PathProvider from "./base/PathProvider";
import EntityPathProvider from "./base/EntityPathProvider";

export default class OpAdminNavigator extends LinkNavigator {

	dashboard: LinkNavigator;

	users: EntityNavigator;

	destinations: EntityNavigator;

	constructor(navigate: NavigateFunction) {
		super(navigate, new PathProvider('/administrace'));
		this.dashboard = new LinkNavigator(navigate, new PathProvider('dashboard', this.provider));
		this.users = new EntityNavigator(navigate, new EntityPathProvider('uzivatele', this.provider));
		this.destinations = new EntityNavigator(navigate, new EntityPathProvider('weby', this.provider));
	}

}
