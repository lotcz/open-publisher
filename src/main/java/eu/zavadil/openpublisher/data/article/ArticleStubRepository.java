package eu.zavadil.openpublisher.data.article;

import eu.zavadil.java.spring.common.entity.EntityRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;

public interface ArticleStubRepository extends EntityRepository<ArticleStub> {

	List<ArticleStub> findAllByDestinationIdOrderByLastUpdatedOnAsc(int destinationId);

	@Query("""
			select a
			from ArticleStub a
			where a.destinationId = :destinationId and a.lastUpdatedOn > :lastArticleUpdatedOn
			order by a.lastUpdatedOn asc
		""")
	List<ArticleStub> loadArticlesForImportFromLastUpdated(
		@Param("destinationId") int destinationId,
		@Param("lastArticleUpdatedOn") Instant lastArticleUpdatedOn
	);

	default List<ArticleStub> loadArticlesForImport(int destinationId, Instant lastArticleUpdatedOn) {
		return lastArticleUpdatedOn == null ? this.findAllByDestinationIdOrderByLastUpdatedOnAsc(destinationId)
			: this.loadArticlesForImportFromLastUpdated(destinationId, lastArticleUpdatedOn);
	}
}
