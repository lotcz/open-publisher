package eu.zavadil.openpublisher.data.user;

import com.fasterxml.jackson.annotation.JsonProperty;
import eu.zavadil.java.spring.common.entity.EntityBase;
import eu.zavadil.openpublisher.data.SyncState;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "usr")
public class User extends EntityBase {

	@JdbcType(PostgreSQLEnumJdbcType.class)
	private SyncState syncState = SyncState.Pending;

	@JdbcType(PostgreSQLEnumJdbcType.class)
	private UserRole userRole = UserRole.Guest;

	private String email;

	private String oauthSubject;

	@JsonProperty(value = "isActive")
	private boolean isActive;

}
