import conf from "../config/conf.json";
import {OAuthRefreshTokenProvider, RestClientWithOAuth} from "zavadil-ts-common";
import {EnumerationsClient} from "./parts/EnumerationsClient";
import {createContext, useContext} from "react";
import {OpStats} from "../types/Stats";
import {ArticlesClient} from "./parts/ArticlesClient";
import {DestinationsClient} from "./parts/DestinationsClient";
import {UsersClient} from "./parts/UsersClient";

export class OpRestClient extends RestClientWithOAuth {

	enumerations: EnumerationsClient;

	articles: ArticlesClient;

	destinations: DestinationsClient;

	users: UsersClient;

	constructor(refreshTokenProvider?: OAuthRefreshTokenProvider) {
		super(conf.API_URL, refreshTokenProvider);

		this.enumerations = new EnumerationsClient(this);
		this.articles = new ArticlesClient(this);
		this.destinations = new DestinationsClient(this);
		this.users = new UsersClient(this);
	}

	version(): Promise<string> {
		return this.get("status/version").then((r) => r.text());
	}

	stats(): Promise<OpStats> {
		return this.getJson("status/stats");
	}

	uploadImage(f: File): Promise<string> {
		let formData = new FormData();
		formData.append("image", f);
		return this.postFormJson('images', formData);
	}

}

export const OpRestClientContext = createContext<OpRestClient | undefined>(undefined);

export function useRestClient(): OpRestClient {
	const ctx = useContext(OpRestClientContext);
	if (!ctx) throw new Error("useRestClient must be used within App!");
	return ctx;
}
