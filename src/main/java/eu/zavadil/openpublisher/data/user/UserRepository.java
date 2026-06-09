package eu.zavadil.openpublisher.data.user;

import eu.zavadil.java.spring.common.entity.EntityRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface UserRepository extends EntityRepository<User> {

	Optional<User> findByEmail(String subject);

	@Query(
		"""
				select u
				from User u
				where u.email ILIKE %:search%
			"""
	)
	Page<User> search(String search, Pageable pr);

}
