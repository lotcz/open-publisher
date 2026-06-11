package eu.zavadil.openpublisher.service;

import eu.zavadil.java.spring.common.paging.PagingUtils;
import eu.zavadil.java.util.StringUtils;
import eu.zavadil.openpublisher.data.articleHistory.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

@Service
public class ArticleHistoryService {

	@Autowired
	ArticleHistoryRepository repository;

	@Autowired
	ArticleHistoryStubRepository stubRepository;

	public Page<ArticleHistory> searchByUser(int userId, int page, int size, String search, String sorting) {
		return StringUtils.isBlank(search) ? this.repository.findAllByUserId(userId, PagingUtils.of(page, size, sorting))
			: this.repository.searchByUser(userId, search, PagingUtils.of(page, size, sorting));
	}

	public Page<ArticleHistory> searchByArticle(int destinationId, int page, int size, String search, String sorting) {
		return StringUtils.isBlank(search) ? this.repository.findAllByArticleId(destinationId, PagingUtils.of(page, size, sorting))
			: this.repository.searchByArticle(destinationId, search, PagingUtils.of(page, size, sorting));
	}

	public ArticleHistoryStub save(int articleId, int userId, ArticleHistoryAction action, String content) {
		ArticleHistoryStub stub = new ArticleHistoryStub();
		stub.setArticleId(articleId);
		stub.setUserId(userId);
		stub.setAction(action);
		stub.setContent(content);
		return this.stubRepository.save(stub);
	}

}
