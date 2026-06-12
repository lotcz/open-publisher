import {Button, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row, Spinner} from "react-bootstrap";
import {BasicDialogProps, Spread} from "zavadil-react-common";
import {useCallback, useContext, useState} from "react";
import {StringUtil} from "zavadil-ts-common";
import ArticlePreview from "./ArticlePreview";
import {ArticleStub} from "../../types/Article";
import TinyMceInput from "../general/TinyMceInput";
import {FileUploadButton} from "../general/FileUploadButton";
import {useRestClient} from "../../client/OpRestClient";
import {UserAlertsContext} from "../../util/UserAlerts";

export type ArticleFullscreenEditDialogProps = BasicDialogProps & {
	article: ArticleStub;
	onConfirmed: (article: ArticleStub) => any;
};

export default function ArticleFullscreenEditDialog({article, onConfirmed, onClose, name}: ArticleFullscreenEditDialogProps) {
	const restClient = useRestClient();
	const userAlerts = useContext(UserAlertsContext);
	const [editing, setEditing] = useState<ArticleStub>({...article})
	const confirm = useCallback(() => onConfirmed(editing), [onConfirmed, editing]);
	const [importing, setImporting] = useState<boolean>(false);

	const onChanged = useCallback(() => {
		setEditing({...editing});
	}, [editing]);

	return <Modal show={true} onHide={confirm} fullscreen={true}>
		{
			name && <ModalHeader>{name}</ModalHeader>
		}
		<ModalBody className="fullscreen-modal">
			{
				importing ? <Spread>
						<div className="text-center">
							<div>Importuji...</div>
							<Spinner/>
						</div>
					</Spread>
					:
					<Row style={{height: "100%", maxHeight: "100%"}} className="overflow-hidden">
						<Col style={{height: "100%", maxHeight: "100%"}}>
							<TinyMceInput
								initialValue={StringUtil.getNonEmpty(editing.contentHtml)}
								onChange={(e) => {
									editing.contentHtml = e;
									onChanged();
								}}
								height="100%"
								stickyToolbar={false}
							/>
						</Col>
						<Col style={{height: "100%", maxHeight: "100%"}} className="overflow-scroll">
							<ArticlePreview article={editing}/>
						</Col>
					</Row>
			}
		</ModalBody>
		<ModalFooter className="justify-content-between">
			<FileUploadButton
				label="Importovat docx..."
				accept=".docx"
				onSelected={
					(file) => {
						setImporting(true);
						restClient.articles
							.importDocx(file)
							.then(
								(imported) => {
									editing.header = imported.title;
									editing.contentHtml = imported.contentHtml;
									onChanged();
								}
							)
							.catch((e) => userAlerts.err(e))
							.finally(() => {
								setImporting(false);
							});
					}
				}
			/>
			<Button onClick={confirm}>Potvrdit</Button>
		</ModalFooter>
	</Modal>

}

