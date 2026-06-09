import conf from "../config/conf.json";
import {OAuthRefreshTokenProvider, RestClientWithOAuth} from "zavadil-ts-common";
import {EnumerationsClient} from "./parts/EnumerationsClient";
import {createContext, useContext} from "react";
import {OpStats} from "../types/Stats";
import {ArticlesClient} from "./parts/ArticlesClient";
import {DestinationsClient} from "./parts/DestinationsClient";
import {UsersClient} from "./parts/UsersClient";
import {ImagesClient} from "./parts/ImagesClient";

export class OpRestClient extends RestClientWithOAuth {

	enumerations: EnumerationsClient;

	articles: ArticlesClient;

	destinations: DestinationsClient;

	users: UsersClient;

	images: ImagesClient;

	constructor(refreshTokenProvider?: OAuthRefreshTokenProvider) {
		super(conf.API_URL, refreshTokenProvider);

		this.enumerations = new EnumerationsClient(this);
		this.articles = new ArticlesClient(this);
		this.destinations = new DestinationsClient(this);
		this.users = new UsersClient(this);
		this.images = new ImagesClient(this);
	}

	version(): Promise<string> {
		return this.get("status/version").then((r) => r.text());
	}

	stats(): Promise<OpStats> {
		return this.getJson("status/stats");
	}

}

export const OpRestClientContext = createContext<OpRestClient | undefined>(undefined);

export function useRestClient(): OpRestClient {
	const ctx = useContext(OpRestClientContext);
	if (!ctx) throw new Error("useRestClient must be used within App!");
	return ctx;
}
