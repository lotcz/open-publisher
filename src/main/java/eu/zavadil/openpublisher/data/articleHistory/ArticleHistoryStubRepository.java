package eu.zavadil.openpublisher.data.articleHistory;

import eu.zavadil.java.spring.common.entity.EntityRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ArticleHistoryStubRepository extends EntityRepository<ArticleHistoryStub> {

}
