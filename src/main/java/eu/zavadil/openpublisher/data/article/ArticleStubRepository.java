package eu.zavadil.openpublisher.data.article;

import eu.zavadil.java.spring.common.entity.EntityRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ArticleStubRepository extends EntityRepository<ArticleStub> {

	List<ArticleStub> findAllByOwnerId(int ownerId);

}
