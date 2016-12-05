package app.handlers;

import java.sql.Timestamp;
import java.util.Map;
import java.util.Optional;

import app.Answer;
import app.Main;
import app.model.Incident;
import app.model.Model;
import app.model.Notification;

import spark.Request;

public class CreateNotificationHandler extends AbstractRequestHandler<Notification> {

	public CreateNotificationHandler(Model model) {
		super(Notification.class, model);
	}

	@Override
	protected Answer processImpl(Notification value, Map<String, String> urlParams, boolean shouldReturnHtml, Request request) {
		DetailUser u = Main.getCurrentUser(request);
		if (u == null) {
			return new Answer(403);
		}
		// some values are self determined
		value.setSender_id(u.getUuid());
		value.setSent_date(new Timestamp(System.currentTimeMillis()));
		// is the sending user the incident reporter?
		// is the receiving user the incident reporter?
		// if not, discard
		Optional<Incident> i = model.getIncident(value.getIncident_id());
		if (!i.isPresent() || (!i.get().getReporter_id().equals(u.getUuid()) && !i.get().getReporter_id().equals(value.getReceiver_id()))) {
			// TODO: audit log, this look like an attempt to hack into our message sending system
			return new Answer(500);
		}
		String messageId = model.createNotification(value);
		if (messageId == null) {
			return new Answer(500);
		}
		// send a websocket message to the target
		WebsocketHandler.sendMessage(value.getReceiver_id(), "You have a new message");
		return new Answer(200, "{\"id\":\"" + messageId + "\"}");
	}
}