package eu.zavadil.openpublisher.api;

import eu.zavadil.java.spring.common.exceptions.BadRequestException;
import eu.zavadil.java.spring.common.exceptions.ResourceNotFoundException;
import eu.zavadil.java.spring.common.paging.JsonPage;
import eu.zavadil.java.spring.common.paging.JsonPageImpl;
import eu.zavadil.openpublisher.data.article.ArticleStub;
import eu.zavadil.openpublisher.data.category.CategoryStub;
import eu.zavadil.openpublisher.data.category.CategoryStubRepository;
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
@RequestMapping("${api.base-url}/articles-sync")
@Tag(name = "Sync articles")
@Slf4j
@Secured({UserRole.API_ROLE_NAME})
public class ArticlesSyncController {

	@Autowired
	DestinationsService destinationsService;

	@Autowired
	ArticlesService articlesService;

	@Autowired
	CategoryStubRepository categoryRepository;

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
		@PathVariable String destinationName,
		@RequestBody(required = false) Instant lastSynced
	) {
		Destination destination = this.destinationsService.loadBySyncName(destinationName);
		if (destination == null) throw new ResourceNotFoundException("Destination", destinationName);
		this.destinationsService.updateLastSynced(destination.getId(), lastSynced);
	}

	@GetMapping("{destinationName}/categories")
	public JsonPage<CategoryStub> getCategories(@PathVariable String destinationName) {
		Destination destination = this.destinationsService.loadBySyncName(destinationName);
		if (destination == null) throw new ResourceNotFoundException("Destination", destinationName);
		List<CategoryStub> result = this.destinationsService.loadCategories(destination.getId());
		return JsonPageImpl.of(result, 0, result.size(), result.size());
	}

	@PutMapping("{destinationName}/categories/{categoryId}")
	public CategoryStub updateCategory(
		@PathVariable String destinationName,
		@PathVariable int categoryId,
		@RequestBody String categoryName
	) {
		Destination destination = this.destinationsService.loadBySyncName(destinationName);
		if (destination == null) throw new ResourceNotFoundException("Destination", destinationName);

		CategoryStub existing = this.categoryRepository.findById(categoryId).orElse(null);
		if (existing == null) throw new ResourceNotFoundException("Category", categoryId);

		if (existing.getDestinationId() != destination.getId())
			throw new BadRequestException("Category doesn't belong to this destination");

		existing.setDestinationId(destination.getId());
		existing.setName(categoryName);
		return this.categoryRepository.save(existing);
	}

	@PostMapping("{destinationName}/categories")
	public CategoryStub insertCategory(
		@PathVariable String destinationName,
		@RequestBody String categoryName
	) {
		Destination destination = this.destinationsService.loadBySyncName(destinationName);
		if (destination == null) throw new ResourceNotFoundException("Destination", destinationName);

		CategoryStub existing = this.categoryRepository.findFirstByDestinationIdAndName(
			destination.getId(),
			categoryName
		).orElse(null);
		if (existing != null) return existing;

		CategoryStub category = new CategoryStub();
		category.setDestinationId(destination.getId());
		category.setName(categoryName);
		return this.categoryRepository.save(category);
	}

	@DeleteMapping("{destinationName}/categories/{categoryId}")
	public void deleteCategory(
		@PathVariable String destinationName,
		@PathVariable int categoryId
	) {
		Destination destination = this.destinationsService.loadBySyncName(destinationName);
		if (destination == null) throw new ResourceNotFoundException("Destination", destinationName);

		CategoryStub existing = this.categoryRepository.findById(categoryId).orElse(null);
		if (existing == null) return;

		if (existing.getDestinationId() != destination.getId())
			throw new BadRequestException("Category doesn't belong to this destination");

		this.categoryRepository.deleteById(categoryId);
	}

	@GetMapping("{destinationName}/articles/{articleId}/categories")
	public List<Integer> loadArticleCategories(
		@PathVariable String destinationName,
		@PathVariable int articleId
	) {
		Destination destination = this.destinationsService.loadBySyncName(destinationName);
		if (destination == null) throw new ResourceNotFoundException("Destination", destinationName);

		ArticleStub article = this.articlesService.loadById(articleId);
		if (article == null) throw new ResourceNotFoundException("Article", destinationName);

		if (article.getDestinationId() != destination.getId())
			throw new BadRequestException("Article doesn't belong to this destination");

		return this.articlesService.loadActiveCategories(articleId);
	}

}
