import {Form, Stack} from "react-bootstrap";
import {DateTimeInput, FormRow, IconButton} from "zavadil-react-common";
import {ArticleStub} from "../../types/Article";
import UserPreview from "../admin/user/UserPreview";
import DestinationIdSelect from "../admin/destination/DestinationIdSelect";
import {NumberUtil} from "zavadil-ts-common";

export type ArticleDetailPublishingTabTabProps = {
	article: ArticleStub;
	onChanged: () => any;
}

export default function ArticleDetailPublishingTab({article, onChanged}: ArticleDetailPublishingTabTabProps) {

	return (
		<div>
			<Form>
				<Stack gap={3}>
					<FormRow label="Cílový web">
						<div className="float-start">
							<DestinationIdSelect
								destinationId={article.destinationId}
								onChange={
									(id) => {
										article.destinationId = id;
										onChanged();
									}
								}
							/>
							{
								NumberUtil.isEmpty(article.destinationId) && <small className="error">Zvolte cílový web</small>
							}
						</div>
					</FormRow>

					<FormRow label="Odložená publikace">
						<div className="float-start">
							<Stack direction="horizontal" gap={2}>
								<DateTimeInput
									value={article.publishDate}
									onChange={(d) => {
										article.publishDate = d || null;
										onChanged();
									}}
								/>
								{
									article.publishDate && <IconButton
										variant="warning"
										onClick={() => {
											article.publishDate = null;
											onChanged();
										}}
									>Vynulovat</IconButton>
								}
							</Stack>
						</div>
					</FormRow>

					<FormRow label="Vlastník">
						<div style={{maxWidth: 900}}>
							<UserPreview userId={article.ownerId}/>
						</div>
					</FormRow>

					{
						article.partnerId && <FormRow label="Partner">
							<div style={{maxWidth: 900}}>
								<UserPreview userId={article.partnerId}/>
							</div>
						</FormRow>
					}
				</Stack>
			</Form>
		</div>
	);
}
