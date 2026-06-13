package eu.zavadil.openpublisher.data.article;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "article")
public class ArticleStub extends ArticleBase {

	@Column(name = "owner_id")
	private int ownerId;

	@Column(name = "partner_id")
	private Integer partnerId;

	@Column(name = "destination_id")
	private int destinationId;
}
