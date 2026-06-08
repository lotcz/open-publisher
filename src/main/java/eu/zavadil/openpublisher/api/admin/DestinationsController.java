package eu.zavadil.openpublisher.api.admin;

import eu.zavadil.java.spring.common.paging.JsonPage;
import eu.zavadil.java.spring.common.paging.JsonPageImpl;
import eu.zavadil.openpublisher.data.destination.Destination;
import eu.zavadil.openpublisher.service.DestinationsService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.base-url}/admin/destinations")
@Tag(name = "Destinations")
@Slf4j
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

	@GetMapping("{id}")
	public Destination load(@PathVariable int id) {
		return this.destinationsService.loadById(id);
	}

	@PostMapping("")
	public Destination insert(@RequestBody Destination document) {
		document.setId(null);
		return this.destinationsService.save(document);
	}

	@PutMapping("{id}")
	public Destination update(@PathVariable int id, @RequestBody Destination document) {
		document.setId(id);
		return this.destinationsService.save(document);
	}

	@DeleteMapping("{id}")
	public void delete(@PathVariable int id) {
		this.destinationsService.delete(id);
	}

}
