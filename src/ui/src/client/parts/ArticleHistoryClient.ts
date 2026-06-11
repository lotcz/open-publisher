import {Page, PagingRequest, PagingUtil, RestClient} from "zavadil-ts-common";
import {ArticleHistory} from "../../types/ArticleHistory";

export class ArticleHistoryClient {

	private name: string;

	private client: RestClient;

	constructor(client: RestClient) {
		this.name = 'article-history'
		this.client = client;
	}

	loadByUser(userId: number, pr?: PagingRequest): Promise<Page<ArticleHistory>> {
		return this.client.getJson(`${this.name}/by-user/${userId}`, PagingUtil.pagingRequestToQueryParams(pr));
	}

	loadByArticle(articleId: number, pr?: PagingRequest): Promise<Page<ArticleHistory>> {
		return this.client.getJson(`${this.name}/by-article/${articleId}`, PagingUtil.pagingRequestToQueryParams(pr));
	}

}
