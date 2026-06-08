package eu.zavadil.openpublisher.data.user;

import lombok.Getter;

@Getter
public enum UserRole {
	Guest("ROLE_GUEST", "guest/*"),
	Editor("ROLE_EDITOR", "editor/*"),
	Admin("ROLE_ADMIN", "*");

	private final String authorityName;

	private final String permission;

	UserRole(String authorityName, String permission) {
		this.authorityName = authorityName;
		this.permission = permission;
	}
}
