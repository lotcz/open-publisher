package eu.zavadil.openpublisher.data.articleHistory;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "article_history")
public class ArticleHistoryStub extends ArticleHistoryBase {

	@Column(name = "article_id")
	private int articleId;

	@Column(name = "user_id")
	private int userId;
}
