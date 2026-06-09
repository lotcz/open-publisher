import {useEffect, useMemo, useState} from "react";
import {ArticleStub} from "../../types/Article";
import ArticlePreviewUtil from "../../util/ArticlePreviewUtil";
import {Destination} from "../../types/Destination";
import {useRestClient} from "../../client/OpRestClient";
import DestinationSelect from "../admin/destination/DestinationSelect";
import {Stack} from "react-bootstrap";
import {useUserSession, useUserSessionUpdate} from "../../util/UserSession";

export type ArticlePreviewProps = {
	article: ArticleStub;
}

export default function ArticlePreview({article}: ArticlePreviewProps) {
	const restClient = useRestClient();
	const userSession = useUserSession();
	const updateSession = useUserSessionUpdate();
	const [destination, setDestination] = useState<Destination | null>();
	const style = useMemo(() => destination ? ArticlePreviewUtil.getStyle(destination) : {}, [destination])

	useEffect(() => {
		const destinationId = userSession.previewDestinationId;
		if (destinationId) {
			restClient.destinations.loadSingle(destinationId).then(setDestination);
		} else {
			restClient.destinations.loadPage({page: 0, size: 1})
				.then((ds) => {
					if (ds.content.length === 0) return;
					const d = ds.content[0];
					setDestination(d);
				})
		}
	}, []);

	useEffect(() => {
		const id = destination ? destination.id : null;
		if (id) {
			userSession.previewDestinationId = id;
			updateSession(userSession);
		}
	}, [destination]);

	return <Stack gap={2}>
		<DestinationSelect destination={destination} onChange={setDestination}/>
		<div className="article-preview p-3" style={style}>
			<h1>{article.header}</h1>
			<div dangerouslySetInnerHTML={{__html: String(article.contentHtml)}}/>
		</div>
	</Stack>

}
