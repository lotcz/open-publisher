package eu.zavadil.openpublisher.data.articleCategory;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Table(name = "article_category")
@NoArgsConstructor
public class ArticleCategory {

	@EmbeddedId
	private ArticleCategoryId id;

	public ArticleCategory(int articleId, int categoryId) {
		this.id = new ArticleCategoryId(articleId, categoryId);
	}

}
