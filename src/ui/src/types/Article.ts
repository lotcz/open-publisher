import {EntityBase} from "zavadil-ts-common";
import {User} from "./User";

export type ArticleBase = EntityBase & {
	articleState: string;
	imageName?: string | null;
	header: string;
	previewText?: string | null;
	contentHtml?: string | null;
	publishDate?: Date | null;
}

export type Article = ArticleBase & {
	owner: User;
	partner: User;
}

export type ArticleStub = ArticleBase & {
	ownerId: number;
	partnerId?: number | null;
}

export type ArticleImage = EntityBase & {
	imageName: string;
	originalName: string;
	articleId: number;
}
