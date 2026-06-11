import {ArticleHistory} from "../../types/ArticleHistory";
import ArticleStateBadge from "./ArticleStateBadge";
import {StringUtil} from "zavadil-ts-common";
import {ArticleImageThumb} from "../images/ArticleImage";
import {BsImage} from "react-icons/bs";
import {useContext} from "react";
import {ArticleHistoryPreviewDialogContext} from "../../util/ArticleHistoryPreviewDialogContext";
import {Button} from "react-bootstrap";

export type ArticleHistoryContentProps = {
	history: ArticleHistory;
}

export default function ArticleHistoryContent({history}: ArticleHistoryContentProps) {
	const previewDialog = useContext(ArticleHistoryPreviewDialogContext);

	if (history.action === 'RemoveImage') return <BsImage/>;

	if (StringUtil.isBlank(history.content)) return <></>;

	if (history.action === 'ChangeState') return <ArticleStateBadge state={String(history.content)}/>;

	if (history.action === 'AddImage') return <ArticleImageThumb name={String(history.content)}/>;

	if (history.action === 'GrantAccess') return <span>{history.content}</span>;

	if (history.action === 'RevokeAccess') return <span className="text-strike">{history.content}</span>;

	if (['Create', 'Edit'].includes(history.action)) return <Button
		variant="outline-primary"
		size="sm"
		onClick={
			() => {
				previewDialog.show(
					{
						onClose: () => {
							previewDialog.hide();
						},
						articleJson: String(history.content)
					}
				);
			}
		}
	>...</Button>;

	return <></>;

}
