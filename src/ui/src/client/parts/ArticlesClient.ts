import {EntityClientWithStub, Page, PagingRequest, PagingUtil, RestClient} from "zavadil-ts-common";
import {Article, ArticleImage, ArticleStub, ImportedArticlePayload} from "../../types/Article";

export class ArticlesClient extends EntityClientWithStub<Article, ArticleStub> {
	constructor(client: RestClient) {
		super(client, "articles");
	}

	loadImages(articleId: number): Promise<Array<ArticleImage>> {
		return this.client.getJson(`${this.name}/${articleId}/images`);
	}

	loadByDestination(destinationId: number, pr?: PagingRequest): Promise<Page<Article>> {
		return this.client.getJson(`${this.name}/by-destination/${destinationId}`, PagingUtil.pagingRequestToQueryParams(pr));
	}

	loadByUser(userId: number, pr?: PagingRequest): Promise<Page<Article>> {
		return this.client.getJson(`${this.name}/by-user/${userId}`, PagingUtil.pagingRequestToQueryParams(pr));
	}

	uploadImage(articleId: number, f: File): Promise<ArticleImage> {
		let formData = new FormData();
		formData.append("image", f);
		return this.client.postFormJson(`${this.name}/${articleId}/images`, formData);
	}

	loadArticleCategories(articleId: number): Promise<Array<number>> {
		return this.client.getJson(`${this.name}/${articleId}/categories`);
	}

	updateArticleCategories(articleId: number, categoryIds: Array<number>): Promise<any> {
		return this.client.putJson(`${this.name}/${articleId}/categories`, categoryIds);
	}

	importDocx(file: File): Promise<ImportedArticlePayload> {
		let formData = new FormData();
		formData.append("file", file);
		return this.client.postFormJson(`${this.name}/import/docx`, formData);
	}

	grantGuestAccess(articleId: number, partnerEmail: string, sendEmail: boolean): Promise<string> {
		return this.client
			.post(`${this.name}/${articleId}/grant-guest-access/${partnerEmail}`, null, {sendEmail})
			.then((r) => r.text());
	}

}

