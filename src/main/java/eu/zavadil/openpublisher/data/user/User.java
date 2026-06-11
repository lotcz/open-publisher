package eu.zavadil.openpublisher.data.user;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import eu.zavadil.java.spring.common.entity.EntityWithNameBase;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "usr")
public class User extends EntityWithNameBase {

	@JdbcType(PostgreSQLEnumJdbcType.class)
	private UserRole userRole = UserRole.Guest;

	private String email;

	@JsonProperty(value = "isActive")
	private boolean active;

	static final int ALGORITHM_LENGTH = 10;

	@JsonIgnore
	@Column(length = ALGORITHM_LENGTH)
	@Size(max = ALGORITHM_LENGTH)
	private String passwordAlgorithm;

	public void setPasswordAlgorithm(String algorithm) {
		this.passwordAlgorithm = this.truncateString(algorithm, ALGORITHM_LENGTH);
	}

	static final int HASH_LENGTH = 255;

	@JsonIgnore
	@Column(length = HASH_LENGTH)
	@Size(max = HASH_LENGTH)
	private String passwordHash;

	public void setPasswordHash(String hash) {
		this.passwordHash = this.truncateString(hash, HASH_LENGTH);
	}

	public static final int SALT_LENGTH = 100;

	@JsonIgnore
	@Column(length = SALT_LENGTH)
	@Size(max = SALT_LENGTH)
	private String passwordSalt;

	public void setPasswordSalt(String salt) {
		this.passwordSalt = this.truncateString(salt, SALT_LENGTH);
	}
}

