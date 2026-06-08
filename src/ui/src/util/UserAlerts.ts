import {UserAlerts} from "zavadil-ts-common";
import {createContext} from "react";

export const UserAlertsContext = createContext<UserAlerts>(new UserAlerts());
