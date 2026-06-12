import {EntityClient, RestClient} from "zavadil-ts-common";
import {User} from "../../types/User";

export class UsersClient extends EntityClient<User> {
	constructor(client: RestClient) {
		super(client, "users");
	}

	profile(): Promise<User> {
		return this.client.getJson(`${this.name}/profile`);
	}

	changeMyPassword(password: string): Promise<any> {
		return this.client.put(`${this.name}/profile/password`, password);
	}

	changePassword(userId: number, password: string): Promise<any> {
		return this.client.put(`${this.name}/${userId}/password`, password);
	}

	sendInvitationLink(userId: number): Promise<any> {
		return this.client.post(`${this.name}/${userId}/send-invitation-link`);
	}

}
