package eu.zavadil.openpublisher.data.user;

import lombok.Getter;

@Getter
public enum UserRole {
	Superuser(UserRole.SUPERUSER_ROLE_NAME, true),
	Admin(UserRole.ADMIN_ROLE_NAME, true),
	Editor(UserRole.EDITOR_ROLE_NAME),
	Guest(UserRole.GUEST_ROLE_NAME);

	public static final String SUPERUSER_ROLE_NAME = "ROLE_SUPERUSER";

	public static final String ADMIN_ROLE_NAME = "ROLE_ADMIN";

	public static final String EDITOR_ROLE_NAME = "ROLE_EDITOR";

	public static final String GUEST_ROLE_NAME = "ROLE_GUEST";

	private final String authorityName;

	private final boolean accessAllArticles;

	UserRole(String authorityName, boolean canAccessAllArticles) {
		this.authorityName = authorityName;
		this.accessAllArticles = canAccessAllArticles;
	}

	UserRole(String authorityName) {
		this(authorityName, false);
	}

}
