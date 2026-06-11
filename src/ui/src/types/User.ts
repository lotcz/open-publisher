import {EntityWithName} from "zavadil-ts-common";

export type User = EntityWithName & {
	userRole: string;
	email: string;
	isActive: boolean;
}

