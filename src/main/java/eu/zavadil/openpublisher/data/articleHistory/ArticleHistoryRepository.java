package eu.zavadil.openpublisher.data.articleHistory;

import eu.zavadil.java.spring.common.entity.EntityRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;

public interface ArticleHistoryRepository extends EntityRepository<ArticleHistory> {

	@Query(
		"""
				select a
				from ArticleHistory a
				where a.user.id = :userId
					AND (a.article.header ILIKE %:search% OR a.article.previewText ILIKE %:search%)
			"""
	)
	Page<ArticleHistory> searchByUser(int userId, String search, Pageable pr);

	Page<ArticleHistory> findAllByUserId(int userId, Pageable pr);

	@Query(
		"""
				select a
				from ArticleHistory a
				where a.article.id = :articleId
					AND (a.user.name ILIKE %:search% OR a.user.email ILIKE %:search%)
			"""
	)
	Page<ArticleHistory> searchByArticle(int articleId, String search, Pageable pr);

	Page<ArticleHistory> findAllByArticleId(int articleId, Pageable pr);

}
