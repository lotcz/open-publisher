package eu.zavadil.openpublisher.data.category;

import eu.zavadil.openpublisher.data.destination.Destination;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "category")
public class Category extends CategoryBase {

	@ManyToOne(optional = false)
	private Destination destination;
}
