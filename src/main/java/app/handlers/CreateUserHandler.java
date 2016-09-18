package app.handlers;

import java.util.Map;
import java.util.UUID;

import app.Answer;
import app.model.Model;
import app.model.User;

public class CreateUserHandler extends AbstractRequestHandler<User> {

	public CreateUserHandler(Model model) {
		super(User.class, model);
		// TODO Auto-generated constructor stub
	}

	@Override
	protected Answer processImpl(User value, Map<String, String> urlParams, boolean shouldReturnHtml) {
		// TODO: create a hash of the password in password_hash
		// TODO: validate the User data before the attempt
		// create a confirmation token
		value.setConfirmation_token(UUID.randomUUID().toString());
		int userId = model.createUser(value);
		return new Answer(200, Integer.toString(userId));
	}

}
