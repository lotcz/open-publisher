import {createContext} from "react";

export type WaitingDialogContextContent = {
	show: (text?: string, onCancel?: () => any) => any;
	progress: (progress?: number, max?: number) => any;
	hide: () => any;
};

export const WaitingDialogContext = createContext<WaitingDialogContextContent>(
	{
		show: () => null,
		progress: () => null,
		hide: () => null
	}
);
