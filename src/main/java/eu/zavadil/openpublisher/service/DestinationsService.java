package eu.zavadil.openpublisher.service;

import eu.zavadil.java.spring.common.paging.PagingUtils;
import eu.zavadil.openpublisher.data.category.CategoryStub;
import eu.zavadil.openpublisher.data.category.CategoryStubRepository;
import eu.zavadil.openpublisher.data.destination.Destination;
import eu.zavadil.openpublisher.data.destination.DestinationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class DestinationsService {

	@Autowired
	DestinationRepository repository;

	@Autowired
	CategoryStubRepository categoryStubRepository;

	public Page<Destination> search(int page, int size, String search, String sorting) {
		return this.repository.search(search, PagingUtils.of(page, size, sorting));
	}

	public List<Destination> loadAllActive() {
		return this.repository.loadAllActive();
	}

	public Destination loadById(int id) {
		return this.repository.findById(id).orElse(null);
	}

	public Destination save(Destination destination) {
		return this.repository.save(destination);
	}

	public void delete(int id) {
		this.repository.deleteById(id);
	}

	public void delete(Destination destination) {
		if (destination.getId() != null) this.delete(destination.getId());
	}

	public List<CategoryStub> loadCategories(int destinationId) {
		return this.categoryStubRepository.findAllByDestinationId(destinationId);
	}

	public Destination loadBySyncName(String syncName) {
		return this.repository.findFirstByApiSyncName(syncName).orElse(null);
	}

	public void updateLastSynced(int destinationId, Instant date) {
		this.repository.updateArticleLastSync(destinationId, date);
	}
}
