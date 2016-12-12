package app.handlers;

import java.util.Map;

import app.Answer;
import app.Main;
import app.model.Model;
import app.model.Message;

import spark.Request;

public class DeleteMessageHandler extends AbstractRequestHandler<Message> {

	public DeleteMessageHandler(Model model) {
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