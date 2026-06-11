import {ArticleHistory} from "../../types/ArticleHistory";
import ArticleStateBadge from "./ArticleStateBadge";
import {StringUtil} from "zavadil-ts-common";
import {ArticleImageThumb} from "../images/ArticleImage";
import {BsImage} from "react-icons/bs";

export type ArticleHistoryContentProps = {
	history: ArticleHistory;
}

export default function ArticleHistoryContent({history}: ArticleHistoryContentProps) {
	return (
		<>
			{
				StringUtil.isBlank(history.content) && <></>
			}
			{
				history.action === 'ChangeState' && <ArticleStateBadge state={String(history.content)}/>
			}
			{
				history.action === 'AddImage' && <ArticleImageThumb name={String(history.content)}/>
			}
			{
				history.action === 'RemoveImage' && <BsImage/>
			}
			{
				(['GrantAccess', 'RevokeAccess'].includes(history.action)) && history.content
			}
		</>
	)
}
