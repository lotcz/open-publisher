package eu.zavadil.openpublisher.config.security;

import eu.zavadil.java.oauth.common.JwtEncoder;
import eu.zavadil.java.oauth.common.token.JwtAccessToken;
import eu.zavadil.java.util.StringUtils;
import eu.zavadil.openpublisher.data.user.User;
import eu.zavadil.openpublisher.service.UsersService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.GenericFilterBean;

import java.io.IOException;

@Component
@Slf4j
public class AuthenticationFilter extends GenericFilterBean {

	@Value("${api.auth-header-name}")
	private String authHeaderName;

	@Value("${oauth.self-name}")
	private String selfName;

	@Value("${oauth.url}")
	String oAuthUrl;

	@Autowired
	JwtEncoder jwtEncoder;

	@Autowired
	UsersService usersService;

	public Authentication getAuthentication(HttpServletRequest request) {
		try {
			String header = request.getHeader(this.authHeaderName);
			if (StringUtils.safeStartsWith(header, "Bearer ")) {
				String tokenRaw = StringUtils.safeSubstr(header, 7, header.length() - 7);
				JwtAccessToken token = jwtEncoder.verifyAndDecodeToken(tokenRaw, JwtAccessToken.class);
				if (!StringUtils.safeEquals(this.selfName, token.getAudience())) {
					log.trace("Audience mismatch! Required: {}, Provided: {}", this.selfName, token.getAudience());
					throw new RuntimeException("Invalid audience!");
				}
				if (!StringUtils.safeEquals(this.oAuthUrl, token.getIssuer())) {
					log.trace("Issuer mismatch! Required: {}, Provided: {}", this.oAuthUrl, token.getIssuer());
					throw new RuntimeException("Invalid issuer!");
				}
				String subject = token.getSubject();
				User user = this.usersService.loadByOAuthSubject(subject);
				if (user != null) return new UserAuthentication(user);
			}
		} catch (Exception e) {
			log.warn("Authentication failed", e);
		}
		return new NoAuthentication();
	}

	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain filterChain)
		throws IOException, ServletException {
		Authentication authentication = this.getAuthentication((HttpServletRequest) request);
		SecurityContextHolder.getContext().setAuthentication(authentication);

		filterChain.doFilter(request, response);
	}
}
