package eu.zavadil.openpublisher.data.user;

import lombok.Getter;

@Getter
public enum UserRole {
	Guest(UserRole.GUEST_ROLE_NAME, "guest/*"),
	Editor(UserRole.EDITOR_ROLE_NAME, "editor/*"),
	Admin(UserRole.ADMIN_ROLE_NAME, "*");

	public static final String GUEST_ROLE_NAME = "ROLE_GUEST";

	public static final String EDITOR_ROLE_NAME = "ROLE_EDITOR";

	public static final String ADMIN_ROLE_NAME = "ROLE_ADMIN";

	private final String authorityName;

	private final String permission;

	UserRole(String authorityName, String permission) {
		this.authorityName = authorityName;
		this.permission = permission;
	}
}
