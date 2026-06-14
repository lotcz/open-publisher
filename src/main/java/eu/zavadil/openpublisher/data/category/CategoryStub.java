package eu.zavadil.openpublisher.data.category;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "category")
public class CategoryStub extends CategoryBase {

	@Column(name = "destination_id")
	private int destinationId;

}
