package eu.zavadil.openpublisher.api;

import eu.zavadil.java.spring.common.exceptions.ResourceNotFoundException;
import eu.zavadil.java.spring.common.paging.JsonPage;
import eu.zavadil.java.spring.common.paging.JsonPageImpl;
import eu.zavadil.openpublisher.data.article.ArticleStub;
import eu.zavadil.openpublisher.data.destination.Destination;
import eu.zavadil.openpublisher.data.user.UserRole;
import eu.zavadil.openpublisher.service.ArticlesService;
import eu.zavadil.openpublisher.service.DestinationsService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

@RestController
@RequestMapping("${api.base-url}/articles-sync")
@Tag(name = "Sync articles")
@Slf4j
@Secured({UserRole.API_ROLE_NAME})
public class ArticlesSyncController {

	@Autowired
	DestinationsService destinationsService;

	@Autowired
	ArticlesService articlesService;

	@GetMapping("{destinationName}")
	public JsonPage<ArticleStub> loadUnsynced(
		@PathVariable String destinationName,
		@RequestParam(required = false, defaultValue = "10") int size
	) {
		Destination destination = this.destinationsService.loadBySyncName(destinationName);
		if (destination == null) throw new ResourceNotFoundException("Destination", destinationName);
		return JsonPageImpl.of(
			this.articlesService.loadArticlesForImport(destination.getId(), destination.getApiSyncLastArticleSynced(), size)
		);
	}

	@PutMapping("{destinationName}/last-synced")
	public void updateLastSynced(
		@PathVariable(required = true) String destinationName,
		@RequestBody(required = false) Instant lastSynced
	) {
		Destination destination = this.destinationsService.loadBySyncName(destinationName);
		if (destination == null) throw new ResourceNotFoundException("Destination", destinationName);
		this.destinationsService.updateLastSynced(destination.getId(), lastSynced);
	}

}
