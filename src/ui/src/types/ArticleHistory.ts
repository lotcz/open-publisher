import {EntityBase} from "zavadil-ts-common";
import {User} from "./User";
import {Article} from "./Article";

export type ArticleHistoryBase = EntityBase & {
	action: string;
	content?: string | null;
}

export type ArticleHistory = ArticleHistoryBase & {
	user: User;
	article: Article;
}

export type ArticleHistoryStub = ArticleHistoryBase & {
	userId: number;
	articleId: number;
}
