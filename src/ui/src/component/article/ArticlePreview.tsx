import {useEffect, useMemo, useState} from "react";
import {ArticleStub} from "../../types/Article";
import ArticlePreviewUtil from "../../util/ArticlePreviewUtil";
import {Destination} from "../../types/Destination";
import {useRestClient} from "../../client/OpRestClient";
import {Stack} from "react-bootstrap";

export type ArticlePreviewProps = {
	article: ArticleStub;
}

export default function ArticlePreview({article}: ArticlePreviewProps) {
	const restClient = useRestClient();
	const [destination, setDestination] = useState<Destination | null>();
	const style = useMemo(() => destination ? ArticlePreviewUtil.getStyle(destination) : {}, [destination])

	useEffect(() => {
		const destinationId = article.destinationId;
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

	return <Stack gap={2}>
		<div className="article-preview p-3" style={style}>
			<h1>{article.header}</h1>
			<div dangerouslySetInnerHTML={{__html: String(article.contentHtml)}}/>
		</div>
	</Stack>

}
