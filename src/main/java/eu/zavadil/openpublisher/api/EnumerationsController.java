package eu.zavadil.openpublisher.api;

import eu.zavadil.java.util.EnumUtils;
import eu.zavadil.openpublisher.data.article.ArticleState;
import eu.zavadil.openpublisher.data.user.UserRole;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("${api.base-url}/enumerations")
@Tag(name = "Enumerations")
@Slf4j
@PreAuthorize("isAuthenticated()")
public class EnumerationsController {

	@GetMapping("user-roles")
	public List<String> userRoles() {
		return EnumUtils.namesOf(UserRole.class);
	}

	@GetMapping("article-states")
	public List<String> articleStates() {
		return EnumUtils.namesOf(ArticleState.class);
	}

}


