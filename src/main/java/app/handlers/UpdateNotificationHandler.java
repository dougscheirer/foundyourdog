package app.handlers;

import java.util.Map;

import app.Answer;
import app.Main;
import app.model.Model;
import app.model.Notification;

import spark.Request;

public class UpdateNotificationHandler extends AbstractRequestHandler<Notification> {

	public UpdateNotificationHandler(Model model) {
		super(Notification.class, model);
	}

	@Override
	protected Answer processImpl(Notification value, Map<String, String> urlParams, boolean shouldReturnHtml, Request request) {
		DetailUser u = Main.getCurrentUser(request);
		if (u == null) {
			return new Answer(403);
		}
		return new Answer(200);
	}
}