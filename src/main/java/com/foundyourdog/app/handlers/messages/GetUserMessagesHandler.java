package com.foundyourdog.app.handlers.messages;

import java.util.List;
import java.util.Map;

import com.foundyourdog.app.Main;
import com.foundyourdog.app.handlers.AbstractRequestHandler;
import com.foundyourdog.app.handlers.Answer;
import com.foundyourdog.app.handlers.EmptyPayload;
import com.foundyourdog.app.handlers.messages.model.DetailMessage;
import com.foundyourdog.app.handlers.users.model.DetailUser;
import com.foundyourdog.app.model.Model;

import spark.Request;

public class GetUserMessagesHandler extends AbstractRequestHandler<EmptyPayload> {

	public GetUserMessagesHandler(Model model) {
		super(EmptyPayload.class, model);
	}

	@Override
	protected Answer processImpl(EmptyPayload value, Map<String, String> urlParams, boolean shouldReturnHtml, Request request) {
		DetailUser u = Main.getCurrentUser(request);
		if (u == null) {
			return new Answer(401);
		}
		List<DetailMessage> message = model.getUserMessages(u.getUuid(), request.queryParams("type").toString());
		return Answer.ok(dataToJson(message));
	}
}