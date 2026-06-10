package eu.zavadil.openpublisher.service;

import eu.zavadil.java.oauth.common.JwtEncoder;
import eu.zavadil.java.oauth.common.exception.JwtTokenExpiredException;
import eu.zavadil.java.oauth.common.exception.JwtTokenInvalidException;
import eu.zavadil.java.oauth.common.payload.response.AccessTokenPayload;
import eu.zavadil.java.oauth.common.token.JwtAccessToken;
import eu.zavadil.java.spring.common.exceptions.BadRequestException;
import eu.zavadil.java.spring.common.exceptions.NotAuthorizedException;
import eu.zavadil.java.util.StringUtils;
import eu.zavadil.openpublisher.data.user.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.List;

@Service
@Slf4j
public class AccessService {

	@Value("${oauth.audience-name}")
	String oauthAudience;

	@Value("${oauth.access.expires-after}")
	Duration accessExpiresAfter;

	@Autowired
	JwtEncoder jwtEncoder;

	@Autowired
	UsersService usersService;

	public String encodeAccessToken(JwtAccessToken accessToken) {
		return this.jwtEncoder.encodeToken(accessToken);
	}

	public AccessTokenPayload accessTokenToPayload(JwtAccessToken accessToken) {
		String accessTokenEncoded = this.encodeAccessToken(accessToken);
		AccessTokenPayload result = new AccessTokenPayload();
		result.setToken(accessTokenEncoded);
		result.setIssuedAt(accessToken.getIssuedAt());
		result.setExpires(accessToken.getExpiration());
		return result;
	}

	public JwtAccessToken createAccessToken(User user) {
		JwtAccessToken token = new JwtAccessToken();
		token.setIssuer(this.oauthAudience);
		token.setSubject(user.getEmail());
		token.setAudience(this.oauthAudience);
		token.setIssuedAt(Instant.now());
		token.setExpiration(Instant.now().plus(this.accessExpiresAfter));
		token.setScopes(List.of());
		return token;
	}

	public String createEncodedAccessToken(User user) {
		return this.jwtEncoder.encodeToken(this.createAccessToken(user));
	}

	public void verifyAccessToken(JwtAccessToken token) {
		if (!StringUtils.safeEquals(this.oauthAudience, token.getAudience())) {
			log.trace("Audience mismatch! Required: {}, Provided: {}", this.oauthAudience, token.getAudience());
			throw new NotAuthorizedException("Invalid audience!");
		}
		if (!StringUtils.safeEquals(this.oauthAudience, token.getIssuer())) {
			log.trace("Issuer mismatch! Required: {}, Provided: {}", this.oauthAudience, token.getIssuer());
			throw new NotAuthorizedException("Invalid issuer!");
		}
	}

	public JwtAccessToken decodeAndVerifyAccessToken(String token) {
		try {
			JwtAccessToken claims = this.jwtEncoder.verifyAndDecodeToken(token, JwtAccessToken.class);
			this.verifyAccessToken(claims);
			return claims;
		} catch (JwtTokenExpiredException e) {
			throw new NotAuthorizedException("Platnost tokenu vypršela!", e);
		} catch (JwtTokenInvalidException e) {
			throw new BadRequestException("Neplatný token!", e);
		}
	}

}
