package eu.zavadil.openpublisher.api;

import eu.zavadil.java.UrlBuilder;
import eu.zavadil.java.spring.common.exceptions.ResourceNotFoundException;
import eu.zavadil.java.spring.common.paging.JsonPage;
import eu.zavadil.java.spring.common.paging.JsonPageImpl;
import eu.zavadil.openpublisher.data.user.User;
import eu.zavadil.openpublisher.data.user.UserRole;
import eu.zavadil.openpublisher.service.AccessService;
import eu.zavadil.openpublisher.service.EmailService;
import eu.zavadil.openpublisher.service.UsersService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.base-url}/users")
@Tag(name = "Users")
@Slf4j
@PreAuthorize("isAuthenticated()")
public class UsersController {

	@Autowired
	UsersService usersService;

	@GetMapping("profile")
	public User getMyself(@AuthenticationPrincipal User user) {
		return user;
	}

	@PutMapping("profile/password")
	@Secured({UserRole.GUEST_ROLE_NAME})
	public void changeMyPassword(
		@AuthenticationPrincipal User user,
		@RequestBody String password
	) {
		this.usersService.changeUserPassword(user.getId(), password);
	}

	@GetMapping("")
	@Secured({UserRole.ADMIN_ROLE_NAME})
	public JsonPage<User> loadPaged(
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size,
		@RequestParam(defaultValue = "") String search,
		@RequestParam(defaultValue = "") String sorting
	) {
		return JsonPageImpl.of(this.usersService.search(page, size, search, sorting));
	}

	@GetMapping("{id}")
	public User load(@PathVariable int id) {
		return this.usersService.loadById(id);
	}

	@PostMapping("")
	@Secured({UserRole.ADMIN_ROLE_NAME})
	public User insert(@RequestBody User document) {
		document.setId(null);
		return this.usersService.save(document);
	}

	@PutMapping("{id}")
	@Secured({UserRole.ADMIN_ROLE_NAME})
	public User update(@PathVariable int id, @RequestBody User document) {
		User existing = this.usersService.loadById(id);
		if (existing == null) throw new ResourceNotFoundException("User", id);

		// preserve authentication data
		document.setPasswordAlgorithm(existing.getPasswordAlgorithm());
		document.setPasswordSalt(existing.getPasswordSalt());
		document.setPasswordHash(existing.getPasswordHash());

		document.setId(id);
		return this.usersService.save(document);
	}

	@DeleteMapping("{id}")
	@Secured({UserRole.ADMIN_ROLE_NAME})
	public void delete(@PathVariable int id) {
		this.usersService.delete(id);
	}

	@PutMapping("{id}/password")
	@Secured({UserRole.ADMIN_ROLE_NAME})
	public void changePassword(
		@PathVariable int id,
		@RequestBody String password
	) {
		this.usersService.changeUserPassword(id, password);
	}

	/*
		SEND INVITATION LINK
	 */

	@Value("${server.allowedOrigin}")
	private String urlBase;

	@Autowired
	private AccessService accessService;

	@Autowired
	EmailService emailService;

	@PostMapping("{id}/send-invitation-link")
	@Secured({UserRole.ADMIN_ROLE_NAME})
	public String grantGuestAccess(
		@AuthenticationPrincipal User authenticatedUser,
		@PathVariable int id
	) {
		User user = this.usersService.loadById(id);
		if (user == null) throw new ResourceNotFoundException("User", id);

		String token = this.accessService.createEncodedAccessToken(user);
		String url = UrlBuilder.of(this.urlBase).addQuery("t", token).buildAsString();

		this.emailService.sendSimpleEmail(
			user.getEmail(),
			"Pozvánka do publikačního systému",
			String.format(
				"""
					Dobrý den,
					
					pro přihlášení použijte následující odkaz: %s
					
					s pozdravem
					%s
					""",
				url,
				authenticatedUser.getEmail()
			)
		);

		return url;
	}

}
