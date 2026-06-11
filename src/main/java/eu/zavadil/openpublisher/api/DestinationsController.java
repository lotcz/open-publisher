package eu.zavadil.openpublisher.api;

import eu.zavadil.java.spring.common.paging.JsonPage;
import eu.zavadil.java.spring.common.paging.JsonPageImpl;
import eu.zavadil.openpublisher.data.destination.Destination;
import eu.zavadil.openpublisher.data.user.UserRole;
import eu.zavadil.openpublisher.service.DestinationsService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.base-url}/destinations")
@Tag(name = "Destinations")
@Slf4j
@PreAuthorize("isAuthenticated()")
public class DestinationsController {

	@Autowired
	DestinationsService destinationsService;

	@GetMapping("")
	public JsonPage<Destination> loadPaged(
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size,
		@RequestParam(defaultValue = "") String search,
		@RequestParam(defaultValue = "") String sorting
	) {
		return JsonPageImpl.of(this.destinationsService.search(page, size, search, sorting));
	}

	@GetMapping("active")
	@Secured({UserRole.EDITOR_ROLE_NAME})
	public List<Destination> loadActive() {
		return this.destinationsService.loadAllActive();
	}

	@GetMapping("{id}")
	public Destination load(@PathVariable int id) {
		return this.destinationsService.loadById(id);
	}

	@PostMapping("")
	@Secured({UserRole.ADMIN_ROLE_NAME})
	public Destination insert(@RequestBody Destination document) {
		document.setId(null);
		return this.destinationsService.save(document);
	}

	@PutMapping("{id}")
	@Secured({UserRole.ADMIN_ROLE_NAME})
	public Destination update(@PathVariable int id, @RequestBody Destination document) {
		document.setId(id);
		return this.destinationsService.save(document);
	}

	@DeleteMapping("{id}")
	@Secured({UserRole.ADMIN_ROLE_NAME})
	public void delete(@PathVariable int id) {
		this.destinationsService.delete(id);
	}

}
