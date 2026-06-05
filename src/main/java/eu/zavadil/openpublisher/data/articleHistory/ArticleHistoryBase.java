package eu.zavadil.openpublisher.data.articleHistory;

import eu.zavadil.java.spring.common.entity.EntityBase;
import eu.zavadil.openpublisher.data.SyncState;
import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@EqualsAndHashCode(callSuper = true)
@Data
@MappedSuperclass
public class ArticleHistoryBase extends EntityBase {

	@JdbcType(PostgreSQLEnumJdbcType.class)
	private ArticleHistoryAction action = ArticleHistoryAction.Edit;

	private String content;

}
