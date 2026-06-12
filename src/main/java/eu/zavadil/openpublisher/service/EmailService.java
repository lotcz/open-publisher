package eu.zavadil.openpublisher.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailService {

	@Value("${emails.sender}")
	String sender;

	@Autowired
	JavaMailSender mailSender;

	public void sendSimpleEmail(String to, String subject, String body) {
		SimpleMailMessage message = new SimpleMailMessage();
		message.setFrom(this.sender);
		message.setTo(to);
		message.setSubject(subject);
		message.setText(body);

		this.mailSender.send(message);
		log.info("Simple email sent to {}", to);
	}

}
