package eu.zavadil.openpublisher.api;

import eu.zavadil.java.UrlBuilder;
import eu.zavadil.java.oauth.common.payload.request.RenewRefreshTokenPayload;
import eu.zavadil.java.oauth.common.payload.request.RequestRefreshTokenFromLoginPayload;
import eu.zavadil.java.oauth.common.payload.response.AccessTokenPayload;
import eu.zavadil.java.oauth.common.token.JwtAccessToken;
import eu.zavadil.java.spring.common.exceptions.BadRequestException;
import eu.zavadil.java.spring.common.exceptions.NotAuthorizedException;
import eu.zavadil.java.spring.common.exceptions.ResourceNotFoundException;
import eu.zavadil.java.util.InstantUtils;
import eu.zavadil.java.util.StringUtils;
import eu.zavadil.openpublisher.data.user.User;
import eu.zavadil.openpublisher.service.AccessService;
import eu.zavadil.openpublisher.service.EmailService;
import eu.zavadil.openpublisher.service.UsersService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

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

		if (!this.usersService.verifyPassword(user, password)) {
			user.setFailedLoginAttempts(user.getFailedLoginAttempts() + 1);
			user.setLastFailedLogin(Instant.now());
			this.usersService.save(user);
			throw new NotAuthorizedException("Neplatné heslo!");
		}

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

	/*
		SEND FORGOTTEN PASSWORD LINK
	 */

	@Value("${server.allowedOrigin}")
	private String urlBase;

	@Autowired
	EmailService emailService;

	@PostMapping("/forgotten-password/{email}")
	public void sendForgottenPasswordEmail(@PathVariable String email) {
		User user = this.usersService.loadByEmail(email);
		if (user == null) throw new ResourceNotFoundException(String.format("Uživatel %s neexistuje.", email));
		if (!user.isActive()) throw new ResourceNotFoundException("Uživatel není aktivní.");

		if (user.getLastLinkSent() != null) {
			if (InstantUtils.differenceInDays(user.getLastLinkSent(), Instant.now()) < 1) {
				throw new BadRequestException("Nelze odeslat link vícekrát než jednou denně");
			}
			;
		}

		String token = this.accessService.createEncodedAccessToken(user);
		String url = UrlBuilder.of(this.urlBase).addQuery("t", token).buildAsString();

		this.emailService.sendForgottenPasswordEmail(user, url);
		user.setLastLinkSent(Instant.now());
		this.usersService.save(user);
	}
}
