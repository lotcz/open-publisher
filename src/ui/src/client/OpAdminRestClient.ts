import {DestinationsClient} from "./parts/DestinationsClient";
import {UsersClient} from "./parts/UsersClient";
import {RestClient} from "zavadil-ts-common";

export class OpAdminRestClient {

	destinations: DestinationsClient;

	users: UsersClient;

	constructor(client: RestClient) {
		this.destinations = new DestinationsClient(client);
		this.users = new UsersClient(client);
	}

}
