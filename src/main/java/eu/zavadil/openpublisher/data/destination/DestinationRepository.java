package eu.zavadil.openpublisher.data.destination;

import eu.zavadil.java.spring.common.entity.EntityRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;

public interface DestinationRepository extends EntityRepository<Destination> {

	@Query(
		"""
				select d
				from Destination d
				where d.name ILIKE %:search%
			"""
	)
	Page<Destination> search(String search, Pageable pr);

}
