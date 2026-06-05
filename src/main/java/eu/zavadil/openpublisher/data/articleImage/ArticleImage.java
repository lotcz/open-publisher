package eu.zavadil.openpublisher.data.articleImage;

import eu.zavadil.java.spring.common.entity.EntityBase;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "article_image")
public class ArticleImage extends EntityBase {

	private String imageName;

	private int articleId;
}
