import {createContext} from "react";
import {UploadImageModalProps} from "../component/images/UploadImageModal";

export type UploadImageDialogContextContent = {
	show: (props: UploadImageModalProps) => any;
	hide: () => any;
};

export const UploadImageDialogContext = createContext<UploadImageDialogContextContent>(
	{
		show: (props) => null,
		hide: () => null
	}
);
