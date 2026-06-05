package eu.zavadil.openpublisher.api;

import eu.zavadil.java.spring.common.exceptions.ResourceNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.InputStream;

@Slf4j
public abstract class ControllerBase {

	/**
	 * Serve frontpage for some in-app urls
	 */
	@GetMapping(value = {"public/**", "designer/**", "creator/**", "admin/**"})
	public @ResponseBody ResponseEntity<InputStreamResource> fallback() {
		InputStream is = ControllerBase.class.getResourceAsStream("/public/index.html");
		if (is == null) throw new ResourceNotFoundException("index.html");
		return ResponseEntity.ok().contentType(MediaType.TEXT_HTML).body(new InputStreamResource(is));
	}
}
