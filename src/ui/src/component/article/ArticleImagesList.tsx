import {useCallback, useContext, useEffect, useState} from "react";
import {TablePlaceholder} from "zavadil-react-common";
import {Button} from "react-bootstrap";
import {useNavigator} from "../../navigator/OpAppNavigator";
import {useRestClient} from "../../client/OpRestClient";
import {UserAlertsContext} from "../../util/UserAlerts";
import {ArticleImage} from "../../types/Article";
import {UploadImageDialogContext} from "../../util/UploadImageDialogContext";
import {ArticleImageThumb} from "../images/ArticleImage";

export type ArticleImagesListProps = {
	articleId: number;
};

export default function ArticleImagesList({articleId}: ArticleImagesListProps) {
	const navigator = useNavigator();
	const restClient = useRestClient();
	const userAlerts = useContext(UserAlertsContext);
	const imageUpload = useContext(UploadImageDialogContext);
	const [images, setImages] = useState<Array<ArticleImage>>();

	const load = useCallback(() => {
		restClient.articles.loadImages(articleId)
			.then(setImages)
			.catch((e: Error) => {
				setImages(undefined);
				userAlerts.err(e);
			});
	}, [articleId, restClient, userAlerts]);

	useEffect(load, [articleId]);

	if (!images) return <TablePlaceholder/>;

	return (
		<div>
			<div className="pt-2 d-flex gap-2 align-items-center">
				<Button
					variant="primary"
					size="sm"
					onClick={
						() => {
							imageUpload.show(
								{
									onClose: () => imageUpload.hide(),
									onSelected: (imageName: string) => {

									}
								}
							);
						}
					}
				>
					+ Nahrát
				</Button>
			</div>
			<div className="pt-2">
				{
					images.map(
						(image) => <ArticleImageThumb name={image.imageName}/>
					)
				}
			</div>
		</div>
	);
}
