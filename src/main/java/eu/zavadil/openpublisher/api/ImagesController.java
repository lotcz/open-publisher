package eu.zavadil.openpublisher.api;

import eu.zavadil.java.imagez.client.*;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("images")
@Tag(name = "Images")
@Slf4j
public class ImagesController {

	@Autowired
	ImagezSmartApi imagez;

	@GetMapping("url/resized/{name}")
	public String getArticleImages(@PathVariable String name) {
		return this.imagez.getImageUrlResized(
			name,
			new ResizeRequest(ResizeType.Crop, 1000, 800, "jpg", VerticalAlign.Center, HorizontalAlign.Center)
		).toString();
	}

	@GetMapping("url/original/{name}")
	public String getUrlOriginal(@PathVariable String name) {
		return this.imagez.getImageUrlOriginal(name).toString();
	}

}
