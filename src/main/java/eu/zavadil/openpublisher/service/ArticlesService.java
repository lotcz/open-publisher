package eu.zavadil.openpublisher.service;

import eu.zavadil.java.imagez.client.ImageHealthPayload;
import eu.zavadil.java.imagez.client.ImagezSmartApi;
import eu.zavadil.java.spring.common.paging.PagingUtils;
import eu.zavadil.openpublisher.data.article.*;
import eu.zavadil.openpublisher.data.articleImage.ArticleImage;
import eu.zavadil.openpublisher.data.articleImage.ArticleImageRepository;
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

	public Page<Article> search(int page, int size, String search, String sorting) {
		return this.repository.search(search, PagingUtils.of(page, size, sorting));
	}

	public ArticleStub loadById(int id) {
		return this.stubRepository.findById(id).orElse(null);
	}

	public ArticleStub save(ArticleStub article) {
		return this.stubRepository.save(article);
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

	public ArticleImage uploadImage(int articleId, String originalFileName, byte[] imageBytes) {
		ArticleImage image = this.loadImage(articleId, originalFileName);
		if (image != null) return image;
		ImageHealthPayload health = this.imagez.upload(originalFileName, imageBytes);
		image = new ArticleImage();
		image.setArticleId(articleId);
		image.setImageName(health.getName());
		return this.imageRepository.save(image);
	}
}
