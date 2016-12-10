package app.handlers;

import java.util.Map;

import app.Answer;
import app.Main;
import app.model.Model;
import app.model.Notification;

import spark.Request;

public class DeleteNotificationHandler extends AbstractRequestHandler<Notification> {

	public DeleteNotificationHandler(Model model) {
		super(Notification.class, model);
	}

	@Override
	protected Answer processImpl(Notification value, Map<String, String> urlParams, boolean shouldReturnHtml, Request request) {
		DetailUser u = Main.getCurrentUser(request);
		if (u == null) {
			return new Answer(401);
		}
		return new Answer(200);
	}
}