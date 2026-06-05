package eu.zavadil.openpublisher.data.articleDestination;

import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class ArticleDestinationId implements Serializable {

	private Integer articleId;

	private Integer destinationId;

	public ArticleDestinationId() {
	}

	public ArticleDestinationId(Integer articleIdd, Integer destinationIdd) {
		this.articleId = articleIdd;
		this.destinationId = destinationIdd;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (!(o instanceof ArticleDestinationId)) return false;
		ArticleDestinationId that = (ArticleDestinationId) o;
		return Objects.equals(articleId, that.articleId) &&
			Objects.equals(destinationId, that.destinationId);
	}

	@Override
	public int hashCode() {
		return Objects.hash(articleId, destinationId);
	}

}
