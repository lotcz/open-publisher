package eu.zavadil.openpublisher.config;

import eu.zavadil.java.oauth.common.JwtEncoder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@Slf4j
public class JwtEncoderConfig {

	@Value("${oauth.rsa-key-path}")
	String rsaKeyPath;

	@Bean
	JwtEncoder jwtEncoder() {
		return new JwtEncoder(this.rsaKeyPath);
	}

}
