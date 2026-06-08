import PathProvider from "./base/PathProvider";
import {NavigateFunction} from "react-router";
import {createContext, useContext} from "react";
import LinkNavigator from "./base/LinkNavigator";
import OpAdminNavigator from "./OpAdminNavigator";
import EntityNavigator from "./base/EntityNavigator";
import EntityPathProvider from "./base/EntityPathProvider";

export default class OpAppNavigator extends LinkNavigator {

	articles: EntityNavigator;

	admin: OpAdminNavigator;

	constructor(navigate: NavigateFunction) {
		super(navigate, new PathProvider(''));
		this.admin = new OpAdminNavigator(navigate);
		this.articles = new EntityNavigator(navigate, new EntityPathProvider('clanky'));
	}

}

export const OpAppNavigatorContext = createContext<OpAppNavigator | null>(null);

export function useNavigator(): OpAppNavigator {
	const ctx = useContext(OpAppNavigatorContext);
	if (!ctx) throw new Error("useNavigator must be used within App!");
	return ctx;
}
