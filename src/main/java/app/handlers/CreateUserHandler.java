package app.handlers;

import java.util.Map;
import java.util.UUID;

import app.Answer;
import app.model.Model;
import app.model.User;
import app.model.UserSignup;

public class CreateUserHandler extends AbstractRequestHandler<UserSignup> {

	public CreateUserHandler(Model model) {
		super(UserSignup.class, model);
		// TODO Auto-generated constructor stub
	}

	@Override
	protected Answer processImpl(UserSignup value, Map<String, String> urlParams, boolean shouldReturnHtml) {
		// TODO: create a hash of the password in password_hash
		// TODO: validate the User data before the attempt
		// create a confirmation token
		int userId = model.signupUser(value);
		return new Answer(200, "{\"id\":\"" + userId + "\"}");
	}
}
