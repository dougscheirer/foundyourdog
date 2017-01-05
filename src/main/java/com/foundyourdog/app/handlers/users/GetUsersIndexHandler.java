package com.foundyourdog.app.handlers.users;

import java.util.List;
import java.util.Map;

import com.foundyourdog.app.handlers.AbstractRequestHandler;
import com.foundyourdog.app.handlers.Answer;
import com.foundyourdog.app.handlers.EmptyPayload;
import com.foundyourdog.app.handlers.users.model.PublicUser;
import com.foundyourdog.app.model.Model;
import spark.Request;

public class GetUsersIndexHandler extends AbstractRequestHandler<EmptyPayload> {

	public GetUsersIndexHandler(Model model) {
		super(EmptyPayload.class, model);
		// TODO Auto-generated constructor stub
	}

	@Override
	protected Answer processImpl(EmptyPayload value, Map<String, String> urlParams, boolean shouldReturnHtml, Request request) {
		List<PublicUser> users = model.getAllPublicUsers();
		return Answer.ok(dataToJson(users));
	}
}
