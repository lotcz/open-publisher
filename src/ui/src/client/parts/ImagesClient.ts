import {RestClient} from "zavadil-ts-common";

export class ImagesClient {

	private client: RestClient;

	constructor(client: RestClient) {
		this.client = client;

	}

	uploadImage(f: File): Promise<string> {
		let formData = new FormData();
		formData.append("image", f);
		return this.client.postForm('images', formData).then((r) => r.text());
	}

	uploadTinyMceImage(blobInfo: any): Promise<string> {
		let formData = new FormData();
		formData.append('image', blobInfo.blob(), blobInfo.filename());
		return this.client.postForm('images', formData)
			.then(
				(r) => r.text()
					.then((name) => this.client.getUrl(`images/${name}/view`).toString())
			);
	}

}
