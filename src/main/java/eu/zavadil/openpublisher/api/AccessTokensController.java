package eu.zavadil.openpublisher.api;

import eu.zavadil.java.oauth.common.payload.request.RenewRefreshTokenPayload;
import eu.zavadil.java.oauth.common.payload.request.RequestRefreshTokenFromLoginPayload;
import eu.zavadil.java.oauth.common.payload.response.AccessTokenPayload;
import eu.zavadil.java.oauth.common.token.JwtAccessToken;
import eu.zavadil.java.spring.common.exceptions.BadRequestException;
import eu.zavadil.java.spring.common.exceptions.NotAuthorizedException;
import eu.zavadil.java.util.StringUtils;
import eu.zavadil.openpublisher.data.user.User;
import eu.zavadil.openpublisher.data.user.UserRole;
import eu.zavadil.openpublisher.service.AccessService;
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
	AccessService accessService;

	@Autowired
	UsersService usersService;

	@GetMapping("/verify/{token}")
	@Operation(summary = "Verify validity of an access token.")
	public AccessTokenPayload verifyAccessToken(@PathVariable String token) {
		JwtAccessToken decoded = this.accessService.decodeAndVerifyAccessToken(token);
		return this.accessService.accessTokenToPayload(decoded);
	}

	@PostMapping("/from-login")
	@Operation(summary = "Obtain access token from login.")
	public AccessTokenPayload login(@RequestBody RequestRefreshTokenFromLoginPayload payload) {
		String login = payload.getLogin();
		String password = payload.getPassword();

		if (StringUtils.isBlank(login)) throw new BadRequestException("Přihlašovací jméno je prázdné!");
		if (StringUtils.isBlank(password)) throw new BadRequestException("Heslo je prázdné!");

		User user = this.usersService.loadByEmail(login);
		if (user == null) throw new NotAuthorizedException("Neznámý uživatel!");
		if (!user.isActive()) throw new NotAuthorizedException("Uživatel není aktivní!");
		if (!this.usersService.verifyPassword(user, password)) throw new NotAuthorizedException("Neplatné heslo!");

		JwtAccessToken token = this.accessService.createAccessToken(user);
		return this.accessService.accessTokenToPayload(token);
	}

	@PostMapping("/renew")
	@Operation(summary = "Renew access token")
	public AccessTokenPayload renew(@RequestBody RenewRefreshTokenPayload payload) {
		JwtAccessToken refresh = this.accessService.decodeAndVerifyAccessToken(payload.getRefreshToken());

		User user = this.usersService.loadByEmail(refresh.getSubject());
		if (user == null) throw new NotAuthorizedException("Neznámý uživatel!");
		if (!user.isActive()) throw new NotAuthorizedException("Uživatel není aktivní!");

		JwtAccessToken token = this.accessService.createAccessToken(user);
		return this.accessService.accessTokenToPayload(token);
	}

	@PostMapping("user/{id}")
	@Secured({UserRole.ADMIN_ROLE_NAME})
	public AccessTokenPayload createAccessToken(@PathVariable int id) {
		User user = this.usersService.loadById(id);
		if (user == null) throw new IllegalArgumentException("Neznámý uživatel!");
		JwtAccessToken token = this.accessService.createAccessToken(user);
		return this.accessService.accessTokenToPayload(token);
	}
}
