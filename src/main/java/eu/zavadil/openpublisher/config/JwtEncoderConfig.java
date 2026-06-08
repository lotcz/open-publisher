package eu.zavadil.openpublisher.config;

import eu.zavadil.java.oauth.client.OAuthClient;
import eu.zavadil.java.oauth.common.JwtEncoder;
import lombok.extern.slf4j.Slf4j;
import org.jose4j.jwk.RsaJsonWebKey;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@Slf4j
public class JwtEncoderConfig {

	@Value("${oauth.rsa-key-path}")
	String rsaKeyPath;

	@Autowired
	OAuthClient oAuthClient;

	RsaJsonWebKey downloadJsonWebKey() {
		return this.oAuthClient.jwk();
	}

	@Bean
	JwtEncoder jwtEncoder() {
		return new JwtEncoder(this.rsaKeyPath, this::downloadJsonWebKey);
	}

}
