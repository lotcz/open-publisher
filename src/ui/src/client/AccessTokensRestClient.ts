import {AccessTokenPayload, RestClient, StringUtil} from "zavadil-ts-common";

export class AccessTokensRestClient extends RestClient {
	constructor(url: string) {
		super(`${StringUtil.trimSlashes(url)}/access-tokens`);
	}

	verifyAccessToken(accessToken: string): Promise<AccessTokenPayload> {
		return this.getJson(`verify/${accessToken}`);
	}

	requestAccessTokenFromLogin(login: string, password: string): Promise<AccessTokenPayload> {
		return this.postJson("from-login", {login, password});
	}

	renewAccessToken(existingToken: string): Promise<AccessTokenPayload> {
		return this.postJson("renew", {existingToken});
	}

}
