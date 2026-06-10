package eu.zavadil.openpublisher.payload;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class ImportedArticlePayload {

	private String title;

	private String contentHtml;

	private List<String> images = new ArrayList<>();

}
