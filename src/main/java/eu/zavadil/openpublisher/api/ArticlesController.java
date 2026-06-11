package eu.zavadil.openpublisher.api;

import eu.zavadil.java.UrlBuilder;
import eu.zavadil.java.spring.common.exceptions.BadRequestException;
import eu.zavadil.java.spring.common.exceptions.NotAuthorizedException;
import eu.zavadil.java.spring.common.exceptions.ResourceNotFoundException;
import eu.zavadil.java.spring.common.exceptions.ServerErrorException;
import eu.zavadil.java.spring.common.paging.JsonPage;
import eu.zavadil.java.spring.common.paging.JsonPageImpl;
import eu.zavadil.java.util.FileNameUtils;
import eu.zavadil.openpublisher.data.article.Article;
import eu.zavadil.openpublisher.data.article.ArticleState;
import eu.zavadil.openpublisher.data.article.ArticleStub;
import eu.zavadil.openpublisher.data.articleImage.ArticleImage;
import eu.zavadil.openpublisher.data.user.User;
import eu.zavadil.openpublisher.data.user.UserRole;
import eu.zavadil.openpublisher.payload.ImportedArticlePayload;
import eu.zavadil.openpublisher.service.AccessService;
import eu.zavadil.openpublisher.service.ArticleImportService;
import eu.zavadil.openpublisher.service.ArticlesService;
import eu.zavadil.openpublisher.service.UsersService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("${api.base-url}/articles")
@Tag(name = "Articles")
@Slf4j
@PreAuthorize("isAuthenticated()")
public class ArticlesController {

	@Autowired
	ArticlesService articlesService;

	@GetMapping("")
	public JsonPage<Article> loadPaged(
		@AuthenticationPrincipal User user,
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size,
		@RequestParam(defaultValue = "") String search,
		@RequestParam(defaultValue = "") String sorting
	) {
		return JsonPageImpl.of(
			user.getUserRole().isAccessAllArticles() ? this.articlesService.search(page, size, search, sorting)
				: this.articlesService.searchByUser(user.getId(), page, size, search, sorting)
		);
	}

	@GetMapping("by-user/{id}")
	@Secured({UserRole.ADMIN_ROLE_NAME})
	public JsonPage<Article> loadPagedByUser(
		@PathVariable int id,
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size,
		@RequestParam(defaultValue = "") String search,
		@RequestParam(defaultValue = "") String sorting
	) {
		return JsonPageImpl.of(this.articlesService.searchByUser(id, page, size, search, sorting));
	}

	@GetMapping("by-destination/{id}")
	@Secured({UserRole.ADMIN_ROLE_NAME})
	public JsonPage<Article> loadPagedByDestination(
		@PathVariable int id,
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size,
		@RequestParam(defaultValue = "") String search,
		@RequestParam(defaultValue = "") String sorting
	) {
		return JsonPageImpl.of(this.articlesService.searchByDestination(id, page, size, search, sorting));
	}

	@GetMapping("{id}")
	public ArticleStub load(
		@AuthenticationPrincipal User user,
		@PathVariable int id
	) {
		ArticleStub article = this.articlesService.loadById(id);
		if (article == null) throw new ResourceNotFoundException("Article with id " + id + " not found");
		if (!this.articlesService.canAccess(user, article))
			throw new NotAuthorizedException("K tomuto článku nemáte právo přístupu");
		return article;
	}

	@PostMapping("")
	@Secured({UserRole.EDITOR_ROLE_NAME})
	public ArticleStub insert(@RequestBody ArticleStub document) {
		document.setId(null);
		return this.articlesService.save(document);
	}

	@PutMapping("{id}")
	public ArticleStub update(
		@AuthenticationPrincipal User user,
		@PathVariable int id,
		@RequestBody ArticleStub document
	) {
		ArticleStub existing = this.articlesService.loadById(id);
		if (existing == null) throw new ResourceNotFoundException("Článek", id);
		if (!this.articlesService.canAccess(user, existing))
			throw new NotAuthorizedException("K tomuto článku nemáte právo přístupu");
		if (user.getUserRole() == UserRole.Guest && existing.getArticleState() == ArticleState.Approved) {
			throw new NotAuthorizedException("Jako externí partner nemáte možnost upravovat schválené články");
		}
		if (user.getUserRole() == UserRole.Guest && document.getArticleState() == ArticleState.Approved) {
			throw new NotAuthorizedException("Jako externí partner nemáte možnost schvalovat články");
		}

		// public fields
		existing.setArticleState(document.getArticleState());
		existing.setImageName(document.getImageName());
		existing.setHeader(document.getHeader());
		existing.setPreviewText(document.getPreviewText());
		existing.setContentHtml(document.getContentHtml());
		existing.setPublishDate(document.getPublishDate());

		// admin fields
		if (user.getUserRole().isAccessAllArticles()) {
			existing.setPartnerId(document.getPartnerId());
			existing.setOwnerId(document.getOwnerId());
			existing.setDestinationId(document.getDestinationId());
		}

		return this.articlesService.save(existing);
	}

	@DeleteMapping("{id}")
	@Secured({UserRole.ADMIN_ROLE_NAME})
	public void delete(@PathVariable int id) {
		this.articlesService.delete(id);
	}

	/*
		ARTICLE IMAGES
	 */

	@GetMapping("{id}/images")
	public List<ArticleImage> getArticleImages(@PathVariable int id) {
		return this.articlesService.loadImages(id);
	}

	@PostMapping("{id}/images")
	public ArticleImage uploadImage(
		@AuthenticationPrincipal User user,
		@PathVariable int id,
		@RequestParam("image") MultipartFile file
	) {
		if (!this.articlesService.canAccess(user, id))
			throw new NotAuthorizedException("K tomuto článku nemáte právo přístupu");

		String originalFileName = FileNameUtils.extractFileName(file.getOriginalFilename());
		try {
			return this.articlesService.uploadArticleImage(id, originalFileName, file.getBytes());
		} catch (Exception e) {
			log.error(e.getMessage());
			throw new ServerErrorException(e);
		}
	}

	@DeleteMapping("{id}/images/{imageName}")
	public void deleteImage(
		@AuthenticationPrincipal User user,
		@PathVariable int id,
		@PathVariable String imageName
	) {
		if (!this.articlesService.canAccess(user, id))
			throw new NotAuthorizedException("K tomuto článku nemáte právo přístupu");

		this.articlesService.deleteImage(id, imageName);
	}

	/*
		ARTICLE DOCX IMPORT
	 */

	@Autowired
	private ArticleImportService importService;

	@PostMapping("/import/docx")
	public ImportedArticlePayload importDocx(@RequestParam("file") MultipartFile file) {
		if (!file.getOriginalFilename().endsWith(".docx")) {
			throw new BadRequestException("Only .docx format is supported!");
		}
		return this.importService.parseDocx(file);
	}

	/*
		ARTICLE GUEST ACCESS
	 */

	@Value("${server.allowedOrigin}")
	private String urlBase;

	@Autowired
	private UsersService usersService;

	@Autowired
	private AccessService accessService;

	@PostMapping("{id}/grant-guest-access/{partnerEmail}")
	@Secured({UserRole.EDITOR_ROLE_NAME})
	public String grantGuestAccess(
		@AuthenticationPrincipal User user,
		@PathVariable int id,
		@PathVariable String partnerEmail
	) {
		ArticleStub article = this.articlesService.loadById(id);
		if (article == null) throw new ResourceNotFoundException("Article not found!");
		if (!this.articlesService.canAccess(user, article))
			throw new NotAuthorizedException("K tomuto článku nemáte právo přístupu");

		User partner = this.usersService.loadByEmail(partnerEmail);
		if (partner == null) {
			partner = new User();
			partner.setEmail(partnerEmail);
			partner.setName(partnerEmail);
			partner.setUserRole(UserRole.Guest);
		}

		partner.setActive(true);
		this.usersService.save(partner);

		article.setPartnerId(partner.getId());
		this.articlesService.save(article);

		String token = this.accessService.createEncodedAccessToken(partner);
		String url = UrlBuilder.of(this.urlBase)
			.addPath("clanky/detail")
			.addPath(article.getId().toString())
			.addQuery("t", token)
			.buildAsString();

		return url;
	}

}
