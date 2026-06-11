import {Button, Form, Stack} from "react-bootstrap";
import {DateTimeInput, FormRow, IconButton} from "zavadil-react-common";
import {ArticleStub} from "../../types/Article";
import UserPreview from "../admin/user/UserPreview";
import ArticleStateBadge from "./ArticleStateBadge";
import DestinationIdSelect from "../admin/destination/DestinationIdSelect";

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
						</div>
					</FormRow>

					<FormRow label="Stav publikace">
						<Stack direction="horizontal" gap={2}>
							<ArticleStateBadge state={article.articleState}/>
							{
								article.articleState === 'Draft' && <>
									<div>Článek není zatím publikován.</div>
									<Button
										variant="success"
										size="sm"
										onClick={() => {
											article.articleState = 'Published';
											onChanged();
										}}>Publikovat</Button>
								</>
							}
							{
								article.articleState === 'Published' && <>
									<div>Článek je publikován.</div>
									<Button
										variant="secondary"
										size="sm"
										onClick={() => {
											article.articleState = 'Hidden';
											onChanged();
										}}>Skrýt</Button>
								</>
							}
							{
								article.articleState === 'Hidden' && <>
									<div>Článek je skrytý.</div>
									<Button
										variant="success"
										size="sm"
										onClick={() => {
											article.articleState = 'Published';
											onChanged();
										}}>Publikovat</Button>
								</>
							}
						</Stack>
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
