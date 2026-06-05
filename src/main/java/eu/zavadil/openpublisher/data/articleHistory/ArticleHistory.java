package eu.zavadil.openpublisher.data.articleHistory;

import eu.zavadil.openpublisher.data.article.Article;
import eu.zavadil.openpublisher.data.user.User;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "article_history")
public class ArticleHistory extends ArticleHistoryBase {

	@ManyToOne(optional = false)
	private Article article;

	@ManyToOne(optional = false)
	private User user;

}
