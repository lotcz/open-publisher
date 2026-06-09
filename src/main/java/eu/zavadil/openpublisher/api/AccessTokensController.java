package eu.zavadil.openpublisher.api;

import eu.zavadil.java.oauth.common.JwtEncoder;
import eu.zavadil.java.oauth.common.exception.JwtTokenExpiredException;
import eu.zavadil.java.oauth.common.exception.JwtTokenInvalidException;
import eu.zavadil.java.oauth.common.payload.request.RenewRefreshTokenPayload;
import eu.zavadil.java.oauth.common.payload.request.RequestRefreshTokenFromLoginPayload;
import eu.zavadil.java.oauth.common.payload.response.AccessTokenPayload;
import eu.zavadil.java.oauth.common.token.JwtAccessToken;
import eu.zavadil.java.oauth.common.util.JwtJsonUtils;
import eu.zavadil.java.spring.common.exceptions.BadRequestException;
import eu.zavadil.java.spring.common.exceptions.NotAuthorizedException;
import eu.zavadil.java.util.StringUtils;
import eu.zavadil.openpublisher.data.user.User;
import eu.zavadil.openpublisher.data.user.UserRole;
import eu.zavadil.openpublisher.service.UsersService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

@RestController
@Tag(name = "JWT Access Tokens")
@RequestMapping("${api.base-url}/access-tokens")
@Slf4j
public class AccessTokensController {

	@Autowired
	JwtEncoder jwtEncoder;

	@Autowired
	UsersService usersService;

	private AccessTokenPayload encodeAccessToken(JwtAccessToken accessToken) {
		String accessTokenEncoded = this.jwtEncoder.encodeToken(accessToken);
		AccessTokenPayload result = new AccessTokenPayload();
		result.setToken(accessTokenEncoded);
		result.setIssuedAt(accessToken.getIssuedAt());
		result.setExpires(accessToken.getExpiration());
		return result;
	}

	@GetMapping("/verify/{token}")
	@Operation(summary = "Verify validity of an access token.")
	public String verifyAccessToken(@PathVariable String token) {
		try {
			JwtAccessToken claims = this.jwtEncoder.verifyAndDecodeToken(token, JwtAccessToken.class);
			this.usersService.verifyAccessToken(claims);
			return JwtJsonUtils.toJson(claims);
		} catch (JwtTokenExpiredException e) {
			throw new NotAuthorizedException("Access token expired!", e);
		} catch (JwtTokenInvalidException e) {
			throw new BadRequestException("Invalid access token!", e);
		}
	}

	@PostMapping("/from-login")
	@Operation(summary = "Obtain access token from login.")
	public AccessTokenPayload login(@RequestBody RequestRefreshTokenFromLoginPayload payload) {
		log.info("Creating refresh token from login {}", payload.getLogin());
		String login = payload.getLogin();
		String password = payload.getPassword();

		if (StringUtils.isBlank(login)) throw new BadRequestException("Login is empty!");
		if (StringUtils.isBlank(password)) throw new BadRequestException("Password is empty!");

		User user = this.usersService.loadByEmail(login);
		if (user == null) throw new NotAuthorizedException("Unknown user!");
		if (!user.isActive()) throw new NotAuthorizedException("User is not active!");
		if (!this.usersService.verifyPassword(user, password)) throw new NotAuthorizedException("Invalid password!");

		JwtAccessToken token = this.usersService.createAccessToken(user);
		return this.encodeAccessToken(token);
	}

	@PostMapping("/renew")
	@Operation(summary = "Renew access token")
	public AccessTokenPayload renew(@RequestBody RenewRefreshTokenPayload payload) {
		try {
			JwtAccessToken refresh = this.jwtEncoder.verifyAndDecodeToken(payload.getRefreshToken(), JwtAccessToken.class);
			this.usersService.verifyAccessToken(refresh);

			User user = this.usersService.loadByEmail(refresh.getSubject());
			if (user == null) throw new NotAuthorizedException("Unknown user!");
			if (!user.isActive()) throw new NotAuthorizedException("User is not active!");

			JwtAccessToken token = this.usersService.createAccessToken(user);
			return this.encodeAccessToken(token);
		} catch (JwtTokenInvalidException e) {
			throw new NotAuthorizedException("Provided refresh token is invalid", e);
		}
	}

	@PostMapping("user/{id}")
	@Secured({UserRole.ADMIN_ROLE_NAME})
	public AccessTokenPayload createAccessToken(@PathVariable int id) {
		User user = this.usersService.loadById(id);
		if (user == null) throw new IllegalArgumentException("User not found");
		JwtAccessToken token = this.usersService.createAccessToken(user);
		return this.encodeAccessToken(token);
	}
}
