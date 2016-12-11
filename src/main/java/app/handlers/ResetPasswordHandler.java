package app.handlers;

import java.util.Optional;

import com.fasterxml.jackson.databind.ObjectMapper;

import app.Answer;
import app.Main;
import app.model.Model;
import app.model.ResetPassword;
import app.model.UserAuth;
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
		Main.mailResetComplete(reset.getEmail());
		return Answer.ok("Reset message sent");
	}
}
