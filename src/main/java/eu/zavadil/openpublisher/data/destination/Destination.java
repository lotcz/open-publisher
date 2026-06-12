package eu.zavadil.openpublisher.data.destination;

import com.fasterxml.jackson.annotation.JsonProperty;
import eu.zavadil.java.spring.common.entity.EntityWithNameBase;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.Instant;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "destination")
public class Destination extends EntityWithNameBase {

	@JsonProperty(value = "isActive")
	private boolean active;

	private int headerLevel = 2;

	static final int SYNC_NAME_LENGTH = 50;

	@Column(length = SYNC_NAME_LENGTH)
	@Size(max = SYNC_NAME_LENGTH)
	private String apiSyncName;

	public void setApiSyncName(String name) {
		this.apiSyncName = this.truncateString(name, SYNC_NAME_LENGTH);
	}

	private Instant apiSyncLastArticleSynced;

	/* PREVIEW DESIGN */

	private int previewWidthPx = 1000;

	static final int COLOR_LENGTH = 20;

	@Column(length = COLOR_LENGTH)
	@Size(max = COLOR_LENGTH)
	private String previewBgColor;

	public void setPreviewBgColor(String color) {
		this.previewBgColor = this.truncateString(color, COLOR_LENGTH);
	}

	@Column(length = COLOR_LENGTH)
	@Size(max = COLOR_LENGTH)
	private String previewTextColor;

	public void setPreviewTextColor(String color) {
		this.previewTextColor = this.truncateString(color, COLOR_LENGTH);
	}

	@Column(length = COLOR_LENGTH)
	@Size(max = COLOR_LENGTH)
	private String previewLinkColor;

	public void setPreviewLinkColor(String color) {
		this.previewLinkColor = this.truncateString(color, COLOR_LENGTH);
	}

	static final int FONT_FAMILY_LENGTH = 255;

	@Column(length = FONT_FAMILY_LENGTH)
	@Size(max = FONT_FAMILY_LENGTH)
	private String previewFontFamily;

	public void setPreviewFontFamily(String family) {
		this.previewFontFamily = this.truncateString(family, FONT_FAMILY_LENGTH);
	}

}
