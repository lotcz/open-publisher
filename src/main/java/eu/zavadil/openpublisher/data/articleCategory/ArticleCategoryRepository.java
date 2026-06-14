package eu.zavadil.openpublisher.data.articleCategory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ArticleCategoryRepository extends JpaRepository<ArticleCategory, Integer> {

	@Query(
		"""
				select ac.id.categoryId
				from ArticleCategory ac
				where ac.id.articleId = :articleId
			"""
	)
	List<Integer> loadArticleCategories(int articleId);

	@Modifying
	@Query(
		"""
				delete
				from ArticleCategory ac
				where ac.id.articleId = :articleId and ac.id.categoryId in (:categories)
			"""
	)
	void deleteArticleCategories(int articleId, List<Integer> categories);

}
