package eu.zavadil.openpublisher.service;

import eu.zavadil.openpublisher.data.user.User;
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

	public void sendInvitationEmail(User senderAdmin, User recipientPartner, String systemUrl) {
		this.sendSimpleEmail(
			recipientPartner.getEmail(),
			"Pozvánka do publikačního systému",
			String.format(
				"""
					Dobrý den,
					
					pro přihlášení do systému použijte následující odkaz: %s
					
					s pozdravem
					%s
					""",
				systemUrl,
				senderAdmin.getEmail()
			)
		);
	}

	public void sendArticleAccessEmail(User senderAdmin, User recipientPartner, String articleUrl) {
		this.sendSimpleEmail(
			recipientPartner.getEmail(),
			"Pozvánka k editaci článku",
			String.format(
				"""
					Dobrý den,
					
					použijte následující odkaz pro editaci článku: %s
					
					s pozdravem
					%s
					""",
				articleUrl,
				senderAdmin.getName()
			)
		);
	}

	public void sendApproveRequestEmail(User senderPartner, User recipientOwner, String articleUrl) {
		this.sendSimpleEmail(
			recipientOwner.getEmail(),
			"Článek je připraven ke schválení",
			String.format(
				"""
					Dobrý den,
					
					uživatel %s požádal o schválení článku: %s
					
					s pozdravem
					%s
					""",
				senderPartner.getName(),
				articleUrl,
				this.sender
			)
		);
	}

}
