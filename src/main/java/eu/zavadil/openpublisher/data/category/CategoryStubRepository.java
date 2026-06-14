package eu.zavadil.openpublisher.data.category;

import eu.zavadil.java.spring.common.entity.EntityRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryStubRepository extends EntityRepository<CategoryStub> {

	List<CategoryStub> findAllByDestinationId(int destinationId);

	Optional<CategoryStub> findFirstByDestinationIdAndName(int destinationId, String name);

}
