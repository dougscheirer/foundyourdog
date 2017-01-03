package com.foundyourdog.app.mail;

import java.io.IOException;
import java.util.Properties;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.foundyourdog.app.ConfigConsts;
import com.sendgrid.*;

public class Mailer {

	private static final Logger log = LoggerFactory.getLogger(Mailer.class);
	
	public static String getEnv(String key, String alt) {
		String value = System.getenv(key);
		return (value == null || value.isEmpty() ? alt : value);
	}
	
	public static boolean sendMail(String subject, String toAddr, String message) {
		String sendgridKey = ConfigConsts.getSendgridAPIKey();
		if (sendgridKey.isEmpty())
			return sendLocalMail(subject, toAddr, message);
	
		Email from = new Email(ConfigConsts.getAdminEmail());
	    Email to = new Email(toAddr);
	    Content content = new Content("text/html", message);
	    Mail mail = new Mail(from, subject, to, content);

	    SendGrid sg = new SendGrid(sendgridKey);
	    Request request = new Request();
	    try {
	      request.method = Method.POST;
	      request.endpoint = "mail/send";
	      request.body = mail.build();
	      Response response = sg.api(request);
	      log.debug("Sendgrid status code: " + response.statusCode);
	      log.debug("Sendgrid response: " + response.body);
	      log.debug("Sendgrid headers: " + response.headers);
	      
	      return true;
	    } catch (IOException ex) {
	      log.error(ex.getMessage());
	    }
	    
	    return false;
	}
	
	private static boolean sendLocalMail(String subject, String toAddr, String message) {
		String from = getEnv("admin_email", "fydo-admin@foundyourdog.com");
		String host = "localhost";
		String port = "1025";

		Properties properties = System.getProperties();
		properties.setProperty("mail.smtp.host", host);
		properties.setProperty("mail.smtp.port", port);
		javax.mail.Session session = javax.mail.Session.getDefaultInstance(properties);

		try {
			MimeMessage mimeMessage = new MimeMessage(session);
			mimeMessage.setFrom(new InternetAddress(from));
			mimeMessage.addRecipient(Message.RecipientType.TO, new InternetAddress(toAddr));
			mimeMessage.setSubject(subject);
			mimeMessage.setContent(message, "text/html");
			Transport.send(mimeMessage);
			return true;
		} catch (MessagingException mex) {
			log.error(mex.getMessage());
		}
		
		return false;
	}
}
