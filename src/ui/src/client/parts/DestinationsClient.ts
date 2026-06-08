import {EntityClient, RestClient} from "zavadil-ts-common";
import {Destination} from "../../types/Destination";

export class DestinationsClient extends EntityClient<Destination> {
	constructor(client: RestClient) {
		super(client, "admin/destinations");
	}

}
