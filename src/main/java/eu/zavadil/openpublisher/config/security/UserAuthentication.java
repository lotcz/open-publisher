package eu.zavadil.openpublisher.config.security;

import eu.zavadil.openpublisher.data.user.User;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.List;

public class UserAuthentication extends AbstractAuthenticationToken {

	private final User user;

	public UserAuthentication(User user) {
		super(List.of(new SimpleGrantedAuthority(user.getUserRole().getAuthorityName())));
		this.user = user;
		setAuthenticated(true);
	}

	@Override
	public Object getCredentials() {
		return null;
	}

	@Override
	public Object getPrincipal() {
		return this.user;
	}

}
