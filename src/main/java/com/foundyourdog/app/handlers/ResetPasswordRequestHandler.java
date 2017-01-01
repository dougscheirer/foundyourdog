package com.foundyourdog.app.handlers;

import java.util.Optional;

import com.fasterxml.jackson.databind.ObjectMapper;

import com.foundyourdog.app.Answer;
import com.foundyourdog.app.Mailer;
import com.foundyourdog.app.Main;
import com.foundyourdog.app.model.Model;
import com.foundyourdog.app.model.UserAuth;
import spark.Request;
import spark.Response;
import spark.Route;

public class ResetPasswordRequestHandler implements Route {
	private Model model;

	public ResetPasswordRequestHandler(Model model) {
		this.model = model;
	}

	@Override
	public Object handle(Request request, Response response) throws Exception {
		ObjectMapper objectMapper = new ObjectMapper();
		// UserAuth is close enough
		UserAuth auth = objectMapper.readValue(request.body(), UserAuth.class);
		
		if (auth.getUser().isEmpty()) {
			response.status(500);
			response.body("Email(user) is required");
			return response.body();
		} 
		
		Optional<DetailUser> user = model.getDetailUserFromEmail(auth.getUser());
		if (!user.isPresent()) {
			// pretend it went fine
			return Answer.ok("Reset message sent").getBody();
		}
		
		// create a reset token, write it to the DB
		String resetToken = model.updatePasswordResetToken(auth.getUser());
		if (resetToken == null) {
			response.status(500);
			response.body("Server error");
			return response.body();
		} 
		
		// send an email with the information
		String resetLink = request.scheme() + "://" + request.host() + "/reset/" + resetToken;
		if (!Mailer.sendMail("Password reset request", 
				auth.getUser(), 
				"To reset your password, follow this link: <a href=\"" + resetLink + "\">" + resetLink + "</a>")) {
			response.status(500);;
			response.body("Server error");
			return response.body();
		}

		return Answer.ok("Reset message sent");
	}
}
