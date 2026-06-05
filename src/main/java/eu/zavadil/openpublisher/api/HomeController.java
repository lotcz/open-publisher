package eu.zavadil.openpublisher.api;

import eu.zavadil.java.spring.common.exceptions.ResourceNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.InputStream;

@Controller
@Slf4j
public class HomeController {

	/**
	 * Serve frontpage for some in-app urls
	 */
	@GetMapping(value = {"clanky/**", "uzivatel/**", "admin/**"})
	public @ResponseBody ResponseEntity<InputStreamResource> fallback() {
		InputStream is = HomeController.class.getResourceAsStream("/public/index.html");
		if (is == null) throw new ResourceNotFoundException("index.html");
		return ResponseEntity.ok().contentType(MediaType.TEXT_HTML).body(new InputStreamResource(is));
	}
}
