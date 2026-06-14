package eu.zavadil.openpublisher.data.articleCategory;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Embeddable
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class ArticleCategoryId implements Serializable {

	private Integer articleId;

	private Integer categoryId;

}
