package eu.zavadil.openpublisher.api;

import eu.zavadil.java.spring.common.paging.JsonPage;
import eu.zavadil.java.spring.common.paging.JsonPageImpl;
import eu.zavadil.openpublisher.data.articleHistory.ArticleHistory;
import eu.zavadil.openpublisher.data.user.UserRole;
import eu.zavadil.openpublisher.service.ArticleHistoryService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.base-url}/article-history")
@Tag(name = "Article History")
@Slf4j
@Secured({UserRole.ADMIN_ROLE_NAME})
public class ArticleHistoryController {

	@Autowired
	ArticleHistoryService articleHistoryService;

	@GetMapping("by-user/{id}")
	public JsonPage<ArticleHistory> loadPagedByUser(
		@PathVariable int id,
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size,
		@RequestParam(defaultValue = "") String search,
		@RequestParam(defaultValue = "") String sorting
	) {
		return JsonPageImpl.of(this.articleHistoryService.searchByUser(id, page, size, search, sorting));
	}

	@GetMapping("by-article/{id}")
	public JsonPage<ArticleHistory> loadPagedByDestination(
		@PathVariable int id,
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size,
		@RequestParam(defaultValue = "") String search,
		@RequestParam(defaultValue = "") String sorting
	) {
		return JsonPageImpl.of(this.articleHistoryService.searchByArticle(id, page, size, search, sorting));
	}

}
