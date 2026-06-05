package eu.zavadil.openpublisher.api;

import eu.zavadil.java.util.EnumUtils;
import eu.zavadil.openpublisher.data.SyncState;
import eu.zavadil.openpublisher.data.user.UserRole;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("${api.base-url}/enumerations")
@Tag(name = "Enumerations")
@Slf4j
public class EnumerationsController {

	@GetMapping("user-roles")
	public List<String> userRoles() {
		return EnumUtils.namesOf(UserRole.class);
	}

	@GetMapping("sync-states")
	public List<String> syncStates() {
		return EnumUtils.namesOf(SyncState.class);
	}

}
