package eu.zavadil.openpublisher.config.security;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.authority.AuthorityUtils;

public class NoAuthentication extends AbstractAuthenticationToken {

	public NoAuthentication() {
		super(AuthorityUtils.NO_AUTHORITIES);
		setAuthenticated(false);
	}

	@Override
	public Object getCredentials() {
		return null;
	}

	@Override
	public Object getPrincipal() {
		return null;
	}
}
