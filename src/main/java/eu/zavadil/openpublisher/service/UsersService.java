package eu.zavadil.openpublisher.service;

import eu.zavadil.java.spring.common.paging.PagingUtils;
import eu.zavadil.java.util.HashUtils;
import eu.zavadil.java.util.StringUtils;
import eu.zavadil.openpublisher.data.user.User;
import eu.zavadil.openpublisher.data.user.UserRepository;
import eu.zavadil.openpublisher.data.user.UserRole;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class UsersService {

	private final String DEFAULT_ALGORITHM = "SHA-256";

	@Value("${oauth.admin.email}")
	String superUserEmail;

	@Value("${oauth.admin.password}")
	String superUserPassword;

	@Autowired
	UserRepository repository;

	@PostConstruct
	public void init() {
		// create default superuser if doesn't exist
		if (StringUtils.notEmpty(this.superUserEmail)) {
			User superuser = this.loadByEmail(this.superUserEmail);
			if (superuser == null) {
				log.info("Creating default superuser {}", this.superUserEmail);
				superuser = new User();
				superuser.setEmail(this.superUserEmail);
				superuser.setActive(true);
				superuser.setUserRole(UserRole.Admin);
				this.save(superuser);
			} else {
				log.info("Default superuser {} found", this.superUserEmail);
			}
			if (StringUtils.notEmpty(this.superUserPassword)) {
				log.info("Setting superuser password and permissions, you can remove password from config to skip this");
				this.changeUserPassword(superuser, this.superUserPassword);
			}
		} else {
			log.info("Default superuser email is not configured");
		}
	}

	public Page<User> search(int page, int size, String search, String sorting) {
		return this.repository.search(search, PagingUtils.of(page, size, sorting));
	}

	public User loadById(int id) {
		return this.repository.findById(id).orElse(null);
	}

	public User loadByEmail(String email) {
		return this.repository.findByEmail(email).orElse(null);
	}

	public User save(User user) {
		return this.repository.save(user);
	}

	public void changeUserPassword(User user, String password) {
		String salt = StringUtils.random(User.SALT_LENGTH);
		user.setPasswordSalt(salt);
		String salted = String.format("%s:%s", salt, password);
		user.setPasswordHash(HashUtils.hash(salted, DEFAULT_ALGORITHM));
		user.setPasswordAlgorithm(DEFAULT_ALGORITHM);
		this.save(user);
	}

	public boolean verifyPassword(User user, String password) {
		String salted = String.format("%s:%s", user.getPasswordSalt(), password);
		return HashUtils.verify(salted, user.getPasswordHash(), user.getPasswordAlgorithm());
	}

	public void changeUserPassword(int userId, String password) {
		this.changeUserPassword(this.loadById(userId), password);
	}

	public void delete(int id) {
		this.repository.deleteById(id);
	}

	public void delete(User user) {
		if (user.getId() != null) this.delete(user.getId());
	}


}
