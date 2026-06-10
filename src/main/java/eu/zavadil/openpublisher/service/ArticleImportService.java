package eu.zavadil.openpublisher.service;

import eu.zavadil.java.imagez.client.*;
import eu.zavadil.java.imagez.client.VerticalAlign;
import eu.zavadil.java.util.StringUtils;
import eu.zavadil.openpublisher.payload.ImportedArticlePayload;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.xwpf.usermodel.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@Slf4j
public class ArticleImportService {

	@Autowired
	ImagezSmartApi imagez;

	public ImportedArticlePayload parseDocx(MultipartFile file) {
		try (XWPFDocument doc = new XWPFDocument(file.getInputStream())) {

			ImportedArticlePayload result = new ImportedArticlePayload();
			StringBuilder content = new StringBuilder();
			boolean titleExtracted = false;

			// Extract paragraphs
			for (XWPFParagraph para : doc.getParagraphs()) {
				String style = para.getStyle();
				String text = para.getText();

				if (titleExtracted == false && (StringUtils.safeEquals(style, "Title") || StringUtils.safeEquals(style, "Heading1"))) {
					result.setTitle(text);
					titleExtracted = true;
				} else if (style != null && style.startsWith("Heading")) {
					int level = Character.getNumericValue(style.charAt(style.length() - 1)) + 1;
					content.append("<h").append(level).append(">")
						.append(text)
						.append("</h").append(level).append(">\n");
				} else {
					StringBuilder inner = new StringBuilder();

					for (XWPFRun run : para.getRuns()) {
						for (XWPFPicture pic : run.getEmbeddedPictures()) {
							XWPFPictureData data = pic.getPictureData();
							ImageHealthPayload health = this.imagez.upload(
								String.format("image.%s", data.suggestFileExtension()),
								data.getData()
							);
							result.getImages().add(health.getName());
							inner
								.append("<img src=\"")
								.append(
									imagez.getImageUrlResized(
										health.getName(),
										new ResizeRequest(
											ResizeType.Fit,
											1000,
											800,
											"webp",
											VerticalAlign.Center,
											HorizontalAlign.Center
										)
									)
								)
								.append("\" style=\"max-width:100%\" />");
						}

						// Then the text of this run
						String runText = run.text();
						if (StringUtils.notBlank(runText)) {
							// Preserve bold/italic
							String span = escapeHtml(runText);
							if (run.isBold()) span = "<strong>" + span + "</strong>";
							if (run.isItalic()) span = "<em>" + span + "</em>";
							inner.append(span);
						}
					}

					if (!inner.isEmpty()) content
						.append("<p>")
						.append(inner.toString())
						.append("</p>");
				}
			}

			result.setContentHtml(content.toString());
			return result;
		} catch (Exception e) {
			log.error("Docx import failed: {}", e.getMessage());
			throw new RuntimeException(e);
		}
	}

	private String escapeHtml(String text) {
		return text.replace("&", "&amp;")
			.replace("<", "&lt;")
			.replace(">", "&gt;");
	}

}
