package eu.zavadil.openpublisher.data.article;

import eu.zavadil.java.spring.common.entity.EntityRepository;
import eu.zavadil.java.spring.common.paging.PagingUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;

public interface ArticleStubRepository extends EntityRepository<ArticleStub> {

	Page<ArticleStub> findAllByDestinationIdOrderByLastUpdatedOnAsc(int destinationId, Pageable pr);

	@Query("""
			select a
			from ArticleStub a
			where a.destinationId = :destinationId and a.lastUpdatedOn > :lastArticleUpdatedOn
			order by a.lastUpdatedOn asc
		""")
	Page<ArticleStub> loadArticlesForImportFromLastUpdated(
		@Param("destinationId") int destinationId,
		@Param("lastArticleUpdatedOn") Instant lastArticleUpdatedOn,
		Pageable pr
	);

	default Page<ArticleStub> loadArticlesForImport(
		int destinationId,
		Instant lastArticleUpdatedOn,
		int size
	) {
		PageRequest pr = PagingUtils.of(0, size);
		return lastArticleUpdatedOn == null ? this.findAllByDestinationIdOrderByLastUpdatedOnAsc(destinationId, pr)
			: this.loadArticlesForImportFromLastUpdated(destinationId, lastArticleUpdatedOn, pr);
	}
}
