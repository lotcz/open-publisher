import {EntityClient, RestClient} from "zavadil-ts-common";
import {Destination} from "../../types/Destination";
import {CategoryStub} from "../../types/Category";

export class DestinationsClient extends EntityClient<Destination> {
	constructor(client: RestClient) {
		super(client, "destinations");
	}

	loadActive(): Promise<Array<Destination>> {
		return this.client.getJson(`${this.name}/active`);
	}

	loadCategories(destinationId: number): Promise<Array<CategoryStub>> {
		return this.client.getJson(`${this.name}/${destinationId}/categories`);
	}

}
