package eu.zavadil.openpublisher.data.user;

import eu.zavadil.java.spring.common.entity.EntityRepository;
import eu.zavadil.openpublisher.data.SyncState;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface UserRepository extends EntityRepository<User> {

	Optional<User> findByOauthSubject(String subject);

	@Query(
		"""
				select u
				from User u
				where u.email ILIKE %:search%
			"""
	)
	Page<User> search(String search, Pageable pr);

	Page<User> findBySyncStateOrderByLastUpdatedOn(SyncState state, Pageable pr);
}
