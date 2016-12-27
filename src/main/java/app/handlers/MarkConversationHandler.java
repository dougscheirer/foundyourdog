package app.handlers;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import app.Answer;
import app.Main;
import app.model.Model;
import app.model.Message;
import spark.Request;

public class MarkConversationHandler extends AbstractRequestHandler<EmptyPayload> {

	public MarkConversationHandler(Model model) {
		super(EmptyPayload.class, model);
	}

	@Override
	protected Answer processImpl(EmptyPayload value, Map<String, String> urlParams, boolean shouldReturnHtml,
			Request request) {
		// get the message from the message ID
		String incident_id = request.queryParams("incident");
		String message_id = request.queryParams("msg");
		// the first fetch "ordinal" is undefined.  if the conversation updates, just fetch with ordinal > ordinal_start
		String ordinal = request.queryParams("ordinal");
		int ordinal_start = 0;
		try {
			ordinal_start = Integer.parseInt(ordinal);
		} catch (NumberFormatException e) {
			// 0 is a fine start
		}
		boolean markRead = Boolean.parseBoolean(request.queryParams("read"));
		if (incident_id == null || message_id == null)
			return new Answer(404);

		Optional<Message> message = model.getMessage(message_id);
		if (!message.isPresent())
			return new Answer(404);

		// validate that the logged in user is the receiver (or an admin)
		DetailUser u = Main.getCurrentUser(request);
		if (!(message.get().getReceiver_id().equals(u.getUuid()) ||
				message.get().getSender_id().equals(u.getUuid()) ||
				u.isAdmin()))
			return new Answer(403);

		// we mark things read for the current user as the receiver, but the logical "conversation"
		// is where the incident, sender, and receiver all match
		Optional<DetailUser> partner = model.getDetailUser((message.get().getReceiver_id().equals(u.getUuid()) ?
				message.get().getSender_id() :
				message.get().getReceiver_id()));
		if (!partner.isPresent())
			return new Answer(404);

		// mark the conversation "read" for user 'u'
		if (model.markConversation(incident_id, message.get().getReceiver_id(), message.get().getSender_id(), u.getUuid(), ordinal_start, markRead))
			return new Answer(200, "{\"unread\":\"" + model.getUnreadMessages(u.getUuid()) + "\"}");
		else
			return new Answer(500, "Failed to update conversation");
	}

}
