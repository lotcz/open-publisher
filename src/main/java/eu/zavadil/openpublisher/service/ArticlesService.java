package eu.zavadil.openpublisher.service;

import eu.zavadil.java.imagez.client.ImageHealthPayload;
import eu.zavadil.java.imagez.client.ImagezSmartApi;
import eu.zavadil.java.spring.common.exceptions.NotAuthorizedException;
import eu.zavadil.java.spring.common.exceptions.ResourceNotFoundException;
import eu.zavadil.java.spring.common.paging.PagingUtils;
import eu.zavadil.java.util.IntegerUtils;
import eu.zavadil.java.util.JsonUtils;
import eu.zavadil.java.util.StringUtils;
import eu.zavadil.openpublisher.data.article.*;
import eu.zavadil.openpublisher.data.articleHistory.ArticleHistoryAction;
import eu.zavadil.openpublisher.data.articleImage.ArticleImage;
import eu.zavadil.openpublisher.data.articleImage.ArticleImageRepository;
import eu.zavadil.openpublisher.data.user.User;
import eu.zavadil.openpublisher.data.user.UserRole;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ArticlesService {

	@Autowired
	ArticleRepository repository;

	@Autowired
	ArticleStubRepository stubRepository;

	@Autowired
	ArticleImageRepository imageRepository;

	@Autowired
	ImagezSmartApi imagez;

	@Autowired
	ArticleHistoryService articleHistoryService;

	@Autowired
	UsersService usersService;

	public Page<Article> search(int page, int size, String search, String sorting) {
		return StringUtils.isBlank(search) ? this.repository.findAll(PagingUtils.of(page, size, sorting))
			: this.repository.search(search, PagingUtils.of(page, size, sorting));
	}

	public Page<Article> searchByUser(int userId, int page, int size, String search, String sorting) {
		return StringUtils.isBlank(search) ? this.repository.loadByUser(userId, PagingUtils.of(page, size, sorting))
			: this.repository.searchByUser(userId, search, PagingUtils.of(page, size, sorting));
	}

	public Page<Article> searchByDestination(int destinationId, int page, int size, String search, String sorting) {
		return StringUtils.isBlank(search) ? this.repository.findAllByDestinationId(destinationId, PagingUtils.of(page, size, sorting))
			: this.repository.searchByDestination(destinationId, search, PagingUtils.of(page, size, sorting));
	}

	public boolean canAccess(User user, ArticleStub article) {
		if (user == null || article == null) return false;
		if (user.getUserRole().isAccessAllArticles()) return true;
		return user.getId() == article.getOwnerId() || user.getId().equals(article.getPartnerId());
	}

	public boolean canAccess(User user, int articleId) {
		return this.canAccess(user, this.loadById(articleId));
	}

	public ArticleStub loadById(int id) {
		return this.stubRepository.findById(id).orElse(null);
	}

	public ArticleStub save(User user, ArticleStub article) {
		boolean updating = article.getId() != null;
		ArticleStub existing = updating ? this.loadById(article.getId()) : null;
		if (updating && existing == null) throw new ResourceNotFoundException("Článek", article.getId());

		if (user.getUserRole() == UserRole.Guest && updating)
			throw new NotAuthorizedException("Jako externí partner nemáte možnost vkládat nové články");
		if (!user.getUserRole().isAccessAllArticles() && article.getArticleState() == ArticleState.Approved)
			throw new NotAuthorizedException("Nemáte možnost schvalovat články");
		if (updating) {
			if (!this.canAccess(user, existing))
				throw new NotAuthorizedException("K tomuto článku nemáte právo přístupu");
			if (!user.getUserRole().isAccessAllArticles() && existing.getArticleState() == ArticleState.Approved)
				throw new NotAuthorizedException("Jako externí partner nemáte možnost upravovat schválené články");
		}

		// PROTECT ADMIN FIELDS

		if (updating && !user.getUserRole().isAccessAllArticles()) {
			if (
				!(
					IntegerUtils.safeEquals(existing.getPartnerId(), article.getPartnerId())
						&& IntegerUtils.safeEquals(existing.getOwnerId(), article.getOwnerId())
						&& IntegerUtils.safeEquals(existing.getDestinationId(), article.getDestinationId())
				)
			) throw new NotAuthorizedException("Neoprávněný pokus o změnu hodnoty");
		}

		// SAVE
		ArticleState oldState = updating ? existing.getArticleState() : null;
		String oldImage = updating ? existing.getImageName() : null;
		String oldHeader = updating ? existing.getHeader() : null;
		String oldContent = updating ? existing.getContentHtml() : null;
		Integer oldDestination = updating ? existing.getDestinationId() : null;
		ArticleStub saved = this.stubRepository.save(article);

		// UPDATE HISTORY

		if (updating) {
			if (!(StringUtils.safeEquals(oldContent, article.getContentHtml()) && StringUtils.safeEquals(oldHeader, article.getHeader()) && IntegerUtils.safeEquals(oldDestination, article.getDestinationId())))
				this.articleHistoryService.save(saved.getId(), user.getId(), ArticleHistoryAction.Edit, JsonUtils.toJson(saved));
			if (saved.getArticleState() != oldState)
				this.articleHistoryService.save(saved.getId(), user.getId(), ArticleHistoryAction.ChangeState, saved.getArticleState().toString());
			if (!StringUtils.safeEquals(saved.getImageName(), oldImage)) {
				if (StringUtils.notBlank(oldImage)) {
					this.articleHistoryService.save(saved.getId(), user.getId(), ArticleHistoryAction.RemoveImage, oldImage);
				}
				if (StringUtils.notBlank(saved.getImageName())) {
					this.articleHistoryService.save(saved.getId(), user.getId(), ArticleHistoryAction.AddImage, saved.getImageName());
				}
			}
		} else {
			this.articleHistoryService.save(saved.getId(), user.getId(), ArticleHistoryAction.Create, JsonUtils.toJson(saved));
			this.articleHistoryService.save(saved.getId(), user.getId(), ArticleHistoryAction.ChangeState, saved.getArticleState().toString());
			if (saved.getPartnerId() != null) {
				User newPartner = this.usersService.loadById(saved.getPartnerId());
				this.articleHistoryService.save(saved.getId(), user.getId(), ArticleHistoryAction.GrantAccess, newPartner.getEmail());
			}
			if (StringUtils.notBlank(saved.getImageName())) {
				this.articleHistoryService.save(saved.getId(), user.getId(), ArticleHistoryAction.AddImage, saved.getImageName());
			}
		}

		return saved;
	}

	public void delete(int id) {
		this.stubRepository.deleteById(id);
	}

	public void delete(ArticleBase article) {
		if (article.getId() != null) this.delete(article.getId());
	}

	public List<ArticleImage> loadImages(int articleId) {
		return this.imageRepository.findAllByArticleId(articleId);
	}

	public ArticleImage loadImage(int articleId, String imageName) {
		return this.imageRepository.findByArticleIdAndImageName(articleId, imageName).orElse(null);
	}

	public void deleteImage(int articleId, String imageName) {
		ArticleImage image = this.loadImage(articleId, imageName);
		if (image != null) this.imageRepository.delete(image);
	}

	public ArticleImage uploadArticleImage(int articleId, String originalFileName, byte[] imageBytes) {
		ArticleImage image = this.loadImage(articleId, originalFileName);
		if (image != null) return image;
		ImageHealthPayload health = this.imagez.upload(originalFileName, imageBytes);
		image = new ArticleImage();
		image.setArticleId(articleId);
		image.setImageName(health.getName());
		return this.imageRepository.save(image);
	}
}
