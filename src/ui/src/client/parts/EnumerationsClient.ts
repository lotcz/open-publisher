import {LazyAsync, RestClient} from "zavadil-ts-common";

export class EnumerationsClient {

	private client: RestClient;

	public userRoles: LazyAsync<string[]>;

	public syncStates: LazyAsync<string[]>;

	public articleStates: LazyAsync<string[]>;

	constructor(client: RestClient) {
		this.client = client;

		this.userRoles = new LazyAsync<string[]>(
			() => this.client.getJson('enumerations/user-roles')
		);

		this.syncStates = new LazyAsync<string[]>(
			() => this.client.getJson('enumerations/sync-states')
		);

		this.articleStates = new LazyAsync<string[]>(
			() => this.client.getJson('enumerations/article-states')
		);

	}

}
