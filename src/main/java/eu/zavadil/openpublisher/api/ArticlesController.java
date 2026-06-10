package eu.zavadil.openpublisher.api;

import eu.zavadil.java.UrlBuilder;
import eu.zavadil.java.spring.common.exceptions.BadRequestException;
import eu.zavadil.java.spring.common.exceptions.ResourceNotFoundException;
import eu.zavadil.java.spring.common.exceptions.ServerErrorException;
import eu.zavadil.java.spring.common.paging.JsonPage;
import eu.zavadil.java.spring.common.paging.JsonPageImpl;
import eu.zavadil.java.util.FileNameUtils;
import eu.zavadil.openpublisher.data.article.Article;
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
		// todo: limit to owned articles for guests
		return JsonPageImpl.of(this.articlesService.search(page, size, search, sorting));
	}

	@GetMapping("{id}")
	public ArticleStub load(@PathVariable int id) {
		return this.articlesService.loadById(id);
	}

	@PostMapping("")
	@Secured({UserRole.EDITOR_ROLE_NAME, UserRole.ADMIN_ROLE_NAME})
	public ArticleStub insert(@RequestBody ArticleStub document) {
		document.setId(null);
		return this.articlesService.save(document);
	}

	@PutMapping("{id}")
	public ArticleStub update(@PathVariable int id, @RequestBody ArticleStub document) {
		document.setId(id);
		return this.articlesService.save(document);
	}

	@DeleteMapping("{id}")
	@Secured({UserRole.EDITOR_ROLE_NAME, UserRole.ADMIN_ROLE_NAME})
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
		@PathVariable int id,
		@RequestParam("image") MultipartFile file
	) {
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
		@PathVariable int id,
		@PathVariable String imageName
	) {
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
	@Secured({UserRole.EDITOR_ROLE_NAME, UserRole.ADMIN_ROLE_NAME})
	public String grantGuestAccess(
		@PathVariable int id,
		@PathVariable String partnerEmail
	) {
		ArticleStub article = this.articlesService.loadById(id);
		if (article == null) throw new ResourceNotFoundException("Article not found!");

		User user = this.usersService.loadByEmail(partnerEmail);
		if (user == null) {
			user = new User();
			user.setEmail(partnerEmail);
			user.setUserRole(UserRole.Guest);
		}

		user.setActive(true);
		this.usersService.save(user);

		article.setPartnerId(user.getId());
		this.articlesService.save(article);

		String token = this.accessService.createEncodedAccessToken(user);
		String url = UrlBuilder.of(this.urlBase)
			.addPath("clanky/detail")
			.addPath(article.getId().toString())
			.addQuery("t", token)
			.buildAsString();

		return url;
	}

}
