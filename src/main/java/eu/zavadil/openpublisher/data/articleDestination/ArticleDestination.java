package eu.zavadil.openpublisher.data.articleDestination;

import eu.zavadil.openpublisher.data.article.Article;
import eu.zavadil.openpublisher.data.destination.Destination;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "article_destination")
public class ArticleDestination {

	@EmbeddedId
	private ArticleDestinationId id;

	@ManyToOne(optional = false)
	@MapsId("articleId")
	@JoinColumn(name = "article_id", nullable = false)
	private Article article;

	@ManyToOne(optional = false)
	@MapsId("destinationId")
	@JoinColumn(name = "destination_id", nullable = false)
	private Destination destination;
	
}
