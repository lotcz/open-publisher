package eu.zavadil.openpublisher.api;

import eu.zavadil.java.spring.common.exceptions.ResourceNotFoundException;
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
import java.util.List;

@RestController
@RequestMapping("${api.base-url}/api-sync")
@Tag(name = "Sync articles")
@Slf4j
@Secured({UserRole.API_ROLE_NAME})
public class ApiSyncController {

	@Autowired
	DestinationsService destinationsService;

	@Autowired
	ArticlesService articlesService;

	@GetMapping("{destinationName}")
	public List<ArticleStub> loadUnsynced(@PathVariable String destinationName) {
		Destination destination = this.destinationsService.loadBySyncName(destinationName);
		if (destination == null) throw new ResourceNotFoundException("Destination", destinationName);
		return this.articlesService.loadArticlesForImport(destination.getId(), destination.getApiSyncLastArticleSynced());
	}

	@PutMapping("{destinationName}/last-synced")
	public void updateLastSynced(@PathVariable String destinationName, @RequestBody Instant lastSynced) {
		Destination destination = this.destinationsService.loadBySyncName(destinationName);
		if (destination == null) throw new ResourceNotFoundException("Destination", destinationName);
		this.destinationsService.updateLastSynced(destination.getId(), lastSynced);
	}

}
