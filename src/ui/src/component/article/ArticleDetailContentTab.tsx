import {Form, Stack} from "react-bootstrap";
import {useContext, useState} from "react";
import {ObjectUtil, StringUtil} from "zavadil-ts-common";
import {FormRow, FormRowControl, IconButton} from "zavadil-react-common";
import {useRestClient} from "../../client/OpRestClient";
import {UserAlertsContext} from "../../util/UserAlerts";
import {ArticleStub} from "../../types/Article";
import TinyMceInput from "../general/TinyMceInput";
import {ArticleImage} from "../images/ArticleImage";
import {FileUploadButton} from "../general/FileUploadButton";
import {ImageUploadButton} from "../images/ImageUploadButton";
import {WaitingDialogContext} from "../../util/WaitingDialogContext";
import ArticleFullscreenEditDialog, {ArticleFullscreenEditDialogProps} from "./ArticleFullscreenEditDialog";
import {BsFullscreen} from "react-icons/bs";

export type ArticleDetailContentTabProps = {
	article: ArticleStub;
	onChanged: () => any;
}

export default function ArticleDetailContentTab({article, onChanged}: ArticleDetailContentTabProps) {
	const restClient = useRestClient();
	const userAlerts = useContext(UserAlertsContext);
	const waitingDialog = useContext(WaitingDialogContext);
	const [importing, setImporting] = useState<boolean>(false);
	const [fullScreenDialog, setFullscreenDialog] = useState<ArticleFullscreenEditDialogProps>();

	return (
		<div className="pt-2">
			<Form>
				<Stack gap={2}>
					<IconButton
						icon={<BsFullscreen/>}
						type="button"
						variant="outline-info"
						onClick={
							() => {
								setFullscreenDialog(
									{
										article: article,
										onClose: () => setFullscreenDialog(undefined),
										onConfirmed: (edited: ArticleStub) => {
											if (edited.contentHtml !== article.contentHtml) {
												article.contentHtml = edited.contentHtml;
												onChanged();
											}
											setFullscreenDialog(undefined);
										}
									}
								);
							}
						}
					>
						Otevřít editaci na celou obrazovku
					</IconButton>
					<FormRow label="Hlavní obrázek">
						<div className="float-start">
							<Stack gap={2}>
								{
									article.imageName && <ArticleImage size="thumb" name={article.imageName}/>
								}
								<Stack direction="horizontal" gap={2}>
									<ImageUploadButton
										label="Nahrát..."
										onSelected={(d) => {
											article.imageName = d || null;
											onChanged();
										}}
									/>
									{
										article.imageName && <IconButton
											size="sm"
											variant="warning"
											onClick={() => {
												article.imageName = null;
												onChanged();
											}}
										>Odstranit obrázek</IconButton>
									}
								</Stack>
							</Stack>
						</div>
					</FormRow>

					<FormRowControl
						label="Perex"
						type="textarea"
						as="textarea"
						value={StringUtil.getNonEmpty(article.previewText)}
						onChange={(e) => {
							article.previewText = e.target.value;
							onChanged();
						}}
					/>

					<FormRow label="Text článku">
						<div style={{maxWidth: 900}}>
							{
								(importing || ObjectUtil.notEmpty(fullScreenDialog)) || <TinyMceInput
									initialValue={StringUtil.getNonEmpty(article.contentHtml)}
									onChange={(e) => {
										article.contentHtml = e;
										onChanged();
									}}
								/>
							}
						</div>
					</FormRow>

					<FormRow label="Import z formátu .docx">
						<FileUploadButton
							label="Nahrát..."
							accept=".docx"
							onSelected={
								(file) => {
									waitingDialog.show("Importuji docx...");
									setImporting(true);
									restClient.articles
										.importDocx(file)
										.then(
											(imported) => {
												article.header = imported.title;
												article.contentHtml = imported.contentHtml;
												onChanged();
											}
										)
										.catch((e) => userAlerts.err(e))
										.finally(() => {
											setImporting(false);
											waitingDialog.hide();
										});
								}
							}
						/>
					</FormRow>
				</Stack>
			</Form>
			{
				fullScreenDialog && <ArticleFullscreenEditDialog {...fullScreenDialog} />
			}
		</div>
	);
}
