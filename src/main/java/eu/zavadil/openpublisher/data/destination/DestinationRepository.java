package eu.zavadil.openpublisher.data.destination;

import eu.zavadil.java.spring.common.entity.EntityRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface DestinationRepository extends EntityRepository<Destination> {

	@Query(
		"""
				select d
				from Destination d
				where d.name ILIKE %:search%
			"""
	)
	Page<Destination> search(String search, Pageable pr);

	List<Destination> findAllByActive(boolean active);

	default List<Destination> loadAllActive() {
		return findAllByActive(true);
	}

	Optional<Destination> findFirstByApiSyncName(String name);

	@Modifying
	@Transactional
	@Query("""
			update Destination d
			set d.apiSyncLastArticleSynced = :date
			where d.id = :destinationId
		""")
	void updateArticleLastSync(
		@Param("destinationId") int destinationId,
		@Param("date") Instant date
	);

}
