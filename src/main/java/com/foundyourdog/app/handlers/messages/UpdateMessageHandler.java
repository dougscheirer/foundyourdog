package com.foundyourdog.app.handlers.messages;

import java.util.Map;

import com.foundyourdog.app.Main;
import com.foundyourdog.app.handlers.AbstractRequestHandler;
import com.foundyourdog.app.handlers.Answer;
import com.foundyourdog.app.handlers.users.model.DetailUser;
import com.foundyourdog.app.model.Model;
import com.foundyourdog.app.model.Message;

import spark.Request;

public class UpdateMessageHandler extends AbstractRequestHandler<Message> {

	public UpdateMessageHandler(Model model) {
		super(Message.class, model);
	}

	@Override
	protected Answer processImpl(Message value, Map<String, String> urlParams, boolean shouldReturnHtml, Request request) {
		DetailUser u = Main.getCurrentUser(request);
		if (u == null) {
			return new Answer(401);
		}
		return new Answer(200);
	}
}