package eu.zavadil.openpublisher.config;

import eu.zavadil.java.imagez.client.ImagezClientHttp;
import eu.zavadil.java.imagez.client.ImagezSmartApi;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@Slf4j
public class ImagezConfig {

	@Value("${imagez.baseUrl}")
	String imagezBaseUrl;

	@Value("${imagez.secretToken}")
	String imagezSecretToken;

	@Bean
	ImagezSmartApi imagezSmartApi() {
		return new ImagezClientHttp(this.imagezBaseUrl, this.imagezSecretToken);
	}
}
