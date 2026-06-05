package eu.zavadil.openpublisher.data.article;

import eu.zavadil.java.spring.common.entity.EntityRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;

public interface ArticleRepository extends EntityRepository<Article> {

	@Query(
		"""
				select a
				from Article a
				where a.header ILIKE %:search% OR a.previewText ILIKE %:search%
			"""
	)
	Page<Article> search(String search, Pageable pr);

}
