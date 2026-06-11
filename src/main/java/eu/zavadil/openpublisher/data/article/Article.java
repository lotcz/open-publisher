package eu.zavadil.openpublisher.data.article;

import eu.zavadil.openpublisher.data.destination.Destination;
import eu.zavadil.openpublisher.data.user.User;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "article")
public class Article extends ArticleBase {

	@ManyToOne(optional = false)
	private User owner;

	@ManyToOne(optional = true)
	private User partner;

	@ManyToOne(optional = false)
	private Destination destination;
}
