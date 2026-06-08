import {createContext, useContext} from "react";
import {User} from "../types/User";

export class UserSession {
	theme: string = "dark";
	user: User;

	constructor(user: User) {
		this.user = user;
	}

}

export const UserSessionContext = createContext<UserSession | null>(null);

export function useUserSession(): UserSession {
	const ctx = useContext(UserSessionContext);
	if (!ctx) throw new Error("useUserSession must be used within App!");
	return ctx;
}

export type UserSessionUpdate = ((s: UserSession) => any) | null;

export const UserSessionUpdateContext = createContext<UserSessionUpdate>(null);

