package eu.zavadil.openpublisher.data.articleImage;

import eu.zavadil.java.spring.common.entity.EntityRepository;

import java.util.List;
import java.util.Optional;

public interface ArticleImageRepository extends EntityRepository<ArticleImage> {

	List<ArticleImage> findAllByArticleId(int articleId);

	Optional<ArticleImage> findByArticleIdAndImageName(int articleId, String imageName);

}
