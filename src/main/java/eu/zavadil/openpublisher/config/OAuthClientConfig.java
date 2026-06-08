package eu.zavadil.openpublisher.config;

import eu.zavadil.java.oauth.client.OAuthClient;
import eu.zavadil.java.oauth.client.OAuthClientHttp;
import eu.zavadil.java.oauth.client.admin.OAuthAdminClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OAuthClientConfig {

	@Value("${oauth.url}")
	String oauthUrl;

	@Value("${oauth.admin.email}")
	String adminEmail;

	@Value("${oauth.admin.password}")
	String adminPassword;

	@Bean
	OAuthClient oAuthClient() {
		return new OAuthClientHttp(this.oauthUrl);
	}

	@Bean
	OAuthAdminClient oAuthAdminClient() {
		return new OAuthAdminClient(this.oauthUrl, this.adminEmail, this.adminPassword);
	}
}
