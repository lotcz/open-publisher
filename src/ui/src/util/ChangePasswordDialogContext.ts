import {createContext} from "react";
import {ChangePasswordDialogProps} from "../component/general/ChangePasswordDialog";

export type ChangePasswordDialogContextContent = {
	show: (props: ChangePasswordDialogProps) => any;
	hide: () => any;
};

export const ChangePasswordDialogContext = createContext<ChangePasswordDialogContextContent>(
	{
		show: (props) => null,
		hide: () => null
	}
);
