import {EntityBase} from "zavadil-ts-common";

export type User = EntityBase & {
	syncState: string;
	userRole: string;
	email: string;
	oauthSubject?: string | null;
	isActive: boolean;
}

