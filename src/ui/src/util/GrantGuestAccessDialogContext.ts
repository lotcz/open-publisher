import {createContext} from "react";
import {GrantGuestAccessDialogProps} from "../component/general/GrantGuestAccessDialog";

export type GrantGuestAccessDialogContextContent = {
	show: (props: GrantGuestAccessDialogProps) => any;
	hide: () => any;
};

export const GrantGuestAccessDialogContext = createContext<GrantGuestAccessDialogContextContent>(
	{
		show: (props) => null,
		hide: () => null
	}
);
