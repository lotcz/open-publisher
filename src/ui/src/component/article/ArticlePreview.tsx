import {useMemo, useState} from "react";
import {ArticleStub} from "../../types/Article";
import ArticlePreviewUtil from "../../util/ArticlePreviewUtil";
import {Destination} from "../../types/Destination";
import {useRestClient} from "../../client/OpRestClient";

export type ArticlePreviewProps = {
	article: ArticleStub;
}

export default function ArticlePreview({article}: ArticlePreviewProps) {
	const restClient = useRestClient();
	const [destinationId, setDestinationId] = useState<number>();
	const [destination, setDestination] = useState<Destination>();
	const style = useMemo(() => destination ? ArticlePreviewUtil.getStyle(destination) : {}, [destination])


	return <div style={style} dangerouslySetInnerHTML={{__html: String(article.contentHtml)}}/>

}
