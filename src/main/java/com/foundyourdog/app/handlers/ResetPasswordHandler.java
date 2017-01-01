package com.foundyourdog.app.handlers;

import com.fasterxml.jackson.databind.ObjectMapper;

import com.foundyourdog.app.Answer;
import com.foundyourdog.app.Mailer;
import com.foundyourdog.app.Main;
import com.foundyourdog.app.model.Model;
import com.foundyourdog.app.model.ResetPassword;
import spark.Request;
import spark.Response;
import spark.Route;

public class ResetPasswordHandler implements Route {
	private Model model;

	public ResetPasswordHandler(Model model) {
		this.model = model;
	}

	@Override
	public Object handle(Request request, Response response) throws Exception {
		ObjectMapper objectMapper = new ObjectMapper();
		ResetPassword reset = objectMapper.readValue(request.body(), ResetPassword.class);
		
		if (reset.getEmail().isEmpty()) {
			response.status(500);
			response.body("Email(user) is required");
			return response.body();
		} 

		boolean resetOK = model.resetPassword(reset);
		if (!resetOK) {
			response.status(403);
			response.body("Password reset failed");
			return response.body();
		}
		
		// send an email with the information
		String url = request.scheme() + "://" + request.host() + "/";
		if (!Mailer.sendMail("Your password was reset", reset.getEmail(), "Your password was reset.<br><a href=\"" + url + "\">" + url + "</a>")) {
			response.status(500);
			response.body("Sever error");
			return response.body();
		}
		
		return Answer.ok("Reset message sent");
	}
}
