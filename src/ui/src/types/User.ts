import {EntityWithName} from "zavadil-ts-common";

export type User = EntityWithName & {
	userRole: string;
	email: string;
	isActive: boolean;
	lastSuccessfulLogin?: Date | null;
	lastFailedLogin?: Date | null;
	lastLinkSent?: Date | null;
	failedLoginAttempts: number;
}

