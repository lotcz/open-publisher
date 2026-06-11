import conf from "../config/conf.json";
import {EnumerationsClient} from "./parts/EnumerationsClient";
import {createContext, useContext} from "react";
import {OpStats} from "../types/Stats";
import {ArticlesClient} from "./parts/ArticlesClient";
import {DestinationsClient} from "./parts/DestinationsClient";
import {UsersClient} from "./parts/UsersClient";
import {ImagesClient} from "./parts/ImagesClient";
import {AccessTokenPayload, RestClient} from "zavadil-ts-common";
import {AccessTokenManager} from "./AccessTokenManager";
import {ArticleHistoryClient} from "./parts/ArticleHistoryClient";

export class OpRestClient extends RestClient {

	tokenManager: AccessTokenManager;

	enumerations: EnumerationsClient;

	articles: ArticlesClient;

	destinations: DestinationsClient;

	users: UsersClient;

	images: ImagesClient;

	articleHistory: ArticleHistoryClient;

	constructor(onLogout: () => any) {
		super(conf.API_URL);

		this.tokenManager = new AccessTokenManager(conf.API_URL, onLogout);

		this.enumerations = new EnumerationsClient(this);
		this.articles = new ArticlesClient(this);
		this.destinations = new DestinationsClient(this);
		this.users = new UsersClient(this);
		this.images = new ImagesClient(this);
		this.articleHistory = new ArticleHistoryClient(this);
	}

	version(): Promise<string> {
		return this.get("status/version").then((r) => r.text());
	}

	stats(): Promise<OpStats> {
		return this.getJson("status/stats");
	}

	initialize(): Promise<AccessTokenPayload> {
		return this.tokenManager.initialize();
	}

	logIn(login: string, password: string): Promise<AccessTokenPayload> {
		return this.tokenManager.logIn(login, password);
	}

	logOut() {
		return this.tokenManager.logOut();
	}

	getHeaders(endpoint: string): Promise<Headers> {
		return this.tokenManager.getAccessTokenRaw()
			.then((accessToken) =>
				super.getHeaders(endpoint).then((headers) => {
					headers.set("Authorization", `Bearer ${accessToken}`);
					return headers;
				}),
			);
	}

}

export const OpRestClientContext = createContext<OpRestClient | undefined>(undefined);

export function useRestClient(): OpRestClient {
	const ctx = useContext(OpRestClientContext);
	if (!ctx) throw new Error("useRestClient must be used within App!");
	return ctx;
}
