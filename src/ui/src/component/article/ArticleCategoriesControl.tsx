import {useEffect, useMemo, useState} from "react";
import {ArticleStub} from "../../types/Article";
import {useRestClient} from "../../client/OpRestClient";
import {CategoryStub} from "../../types/Category";
import {Spinner} from "react-bootstrap";
import {Switch} from "zavadil-react-common";
import {ArrayUtil} from "zavadil-ts-common";

export type ArticleCategoriesControlProps = {
	article: ArticleStub;
	onChanged: (activeCategoryIds: Array<number>) => any;
}

type CategoryItem = {
	id: number;
	selected: boolean;
	name: string;
}

export default function ArticleCategoriesControl({article, onChanged}: ArticleCategoriesControlProps) {
	const restClient = useRestClient();
	const destinationId = useMemo<number | null | undefined>(() => article.destinationId, [article]);
	const articleId = useMemo<number | null | undefined>(() => article.id, [article]);
	const [categories, setCategories] = useState<Array<CategoryStub>>();
	const [activeCategories, setActiveCategories] = useState<Array<number>>();

	useEffect(() => {
		if (destinationId) {
			restClient.destinations.loadCategories(destinationId).then(setCategories);
		} else {
			setCategories(undefined);
		}
	}, [destinationId]);

	useEffect(() => {
		if (articleId) {
			restClient.articles.loadArticleCategories(articleId).then(setActiveCategories);
		} else {
			setActiveCategories([]);
		}
	}, [articleId]);

	const items = useMemo<Array<CategoryItem> | null>(
		() => {
			if (!categories || !activeCategories) return null;
			return categories.map(
				(c: CategoryStub): CategoryItem => {
					const id = Number(c.id);
					return {
						id: id,
						name: c.name,
						selected: activeCategories.includes(id)
					}
				}
			);
		},
		[categories, activeCategories]
	)

	if (!(items && activeCategories)) return <Spinner/>;

	return <div className="d-flex flex-wrap gap-2">
		{
			items.map(
				(item) => <div className="pe-3">
					<Switch
						key={item.id}
						checked={item.selected}
						label={item.name}
						onChange={
							(checked) => {
								let newActiveCats;
								if (checked) {
									newActiveCats = [...activeCategories];
									newActiveCats.push(item.id);
								} else {
									newActiveCats = ArrayUtil.remove(activeCategories, item.id);
								}
								setActiveCategories(newActiveCats);
								onChanged(newActiveCats);
							}
						}
					/>
				</div>
			)
		}
	</div>
}
