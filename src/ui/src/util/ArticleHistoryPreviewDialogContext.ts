import {createContext} from "react";
import {ArticleHistoryPreviewDialogProps} from "../component/article/ArticleHistoryPreviewDialog";

export type ArticleHistoryPreviewDialogContextContent = {
	show: (props: ArticleHistoryPreviewDialogProps) => any;
	hide: () => any;
};

export const ArticleHistoryPreviewDialogContext = createContext<ArticleHistoryPreviewDialogContextContent>(
	{
		show: (props) => null,
		hide: () => null
	}
);
