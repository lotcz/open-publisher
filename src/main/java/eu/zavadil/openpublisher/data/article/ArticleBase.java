package eu.zavadil.openpublisher.data.article;

import eu.zavadil.java.spring.common.entity.EntityBase;
import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

import java.time.Instant;

@EqualsAndHashCode(callSuper = true)
@Data
@MappedSuperclass
public class ArticleBase extends EntityBase {

	@JdbcType(PostgreSQLEnumJdbcType.class)
	private ArticleState articleState = ArticleState.Draft;

	private Instant publishDate;

	private String imageName;

	static final int HEADER_LENGTH = 255;

	@Column(length = HEADER_LENGTH)
	@Size(max = HEADER_LENGTH)
	private String header;

	public void setHeader(String name) {
		this.header = this.truncateString(name, HEADER_LENGTH);
	}

	static final int PREVIEW_LENGTH = 255;

	@Column(length = PREVIEW_LENGTH)
	@Size(max = PREVIEW_LENGTH)
	private String previewText;

	public void setPreviewText(String name) {
		this.previewText = this.truncateString(name, PREVIEW_LENGTH);
	}

	private String contentHtml;

}
