package com.foundyourdog.app.handlers.users;

import java.util.Map;

import org.jasypt.util.password.BasicPasswordEncryptor;

import com.foundyourdog.app.handlers.AbstractRequestHandler;
import com.foundyourdog.app.handlers.Answer;
import com.foundyourdog.app.handlers.users.model.UserSignup;
import com.foundyourdog.app.model.Model;

import spark.Request;

public class CreateUserHandler extends AbstractRequestHandler<UserSignup> {

	public CreateUserHandler(Model model) {
		super(UserSignup.class, model);
		// TODO Auto-generated constructor stub
	}

	@Override
	protected Answer processImpl(UserSignup value, Map<String, String> urlParams, boolean shouldReturnHtml, Request request) {
		// TODO: validate the User data before the attempt
		// create a confirmation token
		BasicPasswordEncryptor passwordEncryptor = new BasicPasswordEncryptor();
		value.setPassword(passwordEncryptor.encryptPassword(value.getPassword()));
		String  userId = model.signupUser(value);
		if (userId != null) {
			return new Answer(200, "{\"id\":\"" + userId + "\"}");
		}
			
		return new Answer(409, "The email or user handle already exists");
	}
}
