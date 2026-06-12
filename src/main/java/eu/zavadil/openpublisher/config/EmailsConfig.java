package eu.zavadil.openpublisher.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

@Configuration
@Slf4j
public class EmailsConfig {

	@Value("${emails.host}")
	String host;

	@Value("${emails.port}")
	int port;

	@Value("${emails.username}")
	String username;

	@Value("${emails.password}")
	String password;

	@Bean
	JavaMailSender javaMailSender() {
		JavaMailSenderImpl sender = new JavaMailSenderImpl();
		sender.setHost(this.host);
		sender.setPort(this.port);
		sender.setUsername(this.username);
		sender.setPassword(this.password);

		Properties javaMailProps = sender.getJavaMailProperties();
		javaMailProps.put("mail.smtp.auth", "true");
		javaMailProps.put("mail.smtp.socketFactory.port", this.port);
		javaMailProps.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
		javaMailProps.put("mail.smtp.ssl.enable", "true");
		javaMailProps.put("mail.smtp.starttls.enable", "false");
		javaMailProps.put("mail.smtp.starttls.required", "false");

		return sender;
	}
}
