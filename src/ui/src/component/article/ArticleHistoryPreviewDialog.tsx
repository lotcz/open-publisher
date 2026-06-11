import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "react-bootstrap";
import {BasicDialogProps} from "zavadil-react-common";
import {useMemo} from "react";
import {JsonUtil} from "zavadil-ts-common";
import ArticlePreview from "./ArticlePreview";

export type ArticleHistoryPreviewDialogProps = BasicDialogProps & {
	articleJson: string;
};

export default function ArticleHistoryPreviewDialog({articleJson, onClose, name}: ArticleHistoryPreviewDialogProps) {
	const article = useMemo(() => JsonUtil.parse(articleJson), [articleJson]);

	return <Modal show={true} onHide={onClose} size="xl">
		{
			name && <ModalHeader>{name}</ModalHeader>
		}
		<ModalBody>
			<ArticlePreview article={article}/>
		</ModalBody>
		<ModalFooter className="justify-content-center">
			<Button onClick={onClose}>Zavřít</Button>
		</ModalFooter>
	</Modal>

}

