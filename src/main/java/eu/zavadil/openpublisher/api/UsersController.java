package eu.zavadil.openpublisher.api;

import eu.zavadil.java.spring.common.paging.JsonPage;
import eu.zavadil.java.spring.common.paging.JsonPageImpl;
import eu.zavadil.openpublisher.data.SyncState;
import eu.zavadil.openpublisher.data.user.User;
import eu.zavadil.openpublisher.data.user.UserRole;
import eu.zavadil.openpublisher.service.UsersService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
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
		document.setSyncState(SyncState.Pending);
		return this.usersService.save(document);
	}

	@PutMapping("{id}")
	@Secured({UserRole.ADMIN_ROLE_NAME})
	public User update(@PathVariable int id, @RequestBody User document) {
		document.setId(id);
		return this.usersService.save(document);
	}

	@DeleteMapping("{id}")
	@Secured({UserRole.ADMIN_ROLE_NAME})
	public void delete(@PathVariable int id) {
		this.usersService.delete(id);
	}

}
