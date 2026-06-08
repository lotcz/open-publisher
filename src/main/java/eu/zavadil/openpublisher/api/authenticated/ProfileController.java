package eu.zavadil.openpublisher.api.authenticated;

import eu.zavadil.openpublisher.data.user.User;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("${api.base-url}/authenticated/profile")
@Tag(name = "Profile")
@Slf4j
public class ProfileController {

	@GetMapping("")
	public User getMyself(@AuthenticationPrincipal User user) {
		return user;
	}

}
