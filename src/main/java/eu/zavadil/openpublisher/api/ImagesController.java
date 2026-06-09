package eu.zavadil.openpublisher.api;

import eu.zavadil.java.imagez.client.*;
import eu.zavadil.java.spring.common.exceptions.ServerErrorException;
import eu.zavadil.java.util.FileNameUtils;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URI;

@RestController
@RequestMapping("${api.base-url}/images")
@Tag(name = "Images")
@Slf4j
@PreAuthorize("isAuthenticated()")
public class ImagesController {

	@Autowired
	ImagezSmartApi imagez;

	private URI getResizedUri(String imageName, int width, int height) {
		try {
			return this.imagez.getImageUrlResized(
				imageName,
				new ResizeRequest(
					ResizeType.Fit,
					width,
					height,
					"webp",
					VerticalAlign.Center,
					HorizontalAlign.Center
				)
			).toURI();
		} catch (Exception e) {
			log.error(e.getMessage(), e);
			throw new ServerErrorException(e);
		}
	}

	@GetMapping("{imageName}/view")
	public ResponseEntity<Void> getImageView(@PathVariable String imageName) {
		return ResponseEntity
			.status(HttpStatus.FOUND)
			.location(this.getResizedUri(imageName, 1920, 1080))
			.build();
	}

	@GetMapping("{imageName}/preview")
	public ResponseEntity<Void> getImagePreview(@PathVariable String imageName) {
		return ResponseEntity
			.status(HttpStatus.FOUND)
			.location(this.getResizedUri(imageName, 640, 640))
			.build();
	}

	@GetMapping("{imageName}/thumb")
	public ResponseEntity<Void> getImageThumb(@PathVariable String imageName) {
		return ResponseEntity
			.status(HttpStatus.FOUND)
			.location(this.getResizedUri(imageName, 160, 160))
			.build();
	}

	private String getOriginalUrl(String imageName) {
		return this.imagez.getImageUrlOriginal(imageName).toString();
	}

	@GetMapping("{imageName}/original/url")
	public String getUrlOriginal(@PathVariable String imageName) {
		return this.getOriginalUrl(imageName);
	}

	@GetMapping("{imageName}/original")
	public ResponseEntity<Void> getOriginalImage(@PathVariable String imageName) {
		return ResponseEntity.status(HttpStatus.FOUND)
			.location(URI.create(this.getOriginalUrl(imageName)))
			.build();
	}

	@PostMapping("")
	public String uploadImage(@RequestParam("image") MultipartFile file) {
		String originalFileName = FileNameUtils.extractFileName(file.getOriginalFilename());
		try {
			ImageHealthPayload health = this.imagez.upload(originalFileName, file.getBytes());
			return health.getName();
		} catch (Exception e) {
			log.error(e.getMessage());
			throw new ServerErrorException(e);
		}
	}

}
