package app.handlers;

import java.util.List;
import java.util.Map;

import app.Answer;
import app.Main;
import app.model.Model;

import spark.Request;

public class GetUserNotifications extends AbstractRequestHandler<EmptyPayload> {

	public GetUserNotifications(Model model) {
		super(EmptyPayload.class, model);
	}

	@Override
	protected Answer processImpl(EmptyPayload value, Map<String, String> urlParams, boolean shouldReturnHtml, Request request) {
		DetailUser u = Main.getCurrentUser(request);
		if (u == null) {
			return new Answer(403);
		}
		List<DetailNotification> notifications = model.getUserNotifications(u.getUuid(), request.queryParams("type").toString());
		return Answer.ok(dataToJson(notifications));
	}
}