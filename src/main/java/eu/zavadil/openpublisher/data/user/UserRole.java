package eu.zavadil.openpublisher.data.user;

import lombok.Getter;

@Getter
public enum UserRole {
	Guest("GUEST", "guest/*"),
	Editor("EDITOR", "editor/*"),
	Admin("ADMIN", "*");

	private final String authorityName;

	private final String permission;

	UserRole(String authorityName, String permission) {
		this.authorityName = authorityName;
		this.permission = permission;
	}
}
