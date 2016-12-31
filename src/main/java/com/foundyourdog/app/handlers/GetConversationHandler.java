package com.foundyourdog.app.handlers;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.foundyourdog.app.Answer;
import com.foundyourdog.app.Main;
import com.foundyourdog.app.model.Model;
import com.foundyourdog.app.model.Message;
import spark.Request;

public class GetConversationHandler extends AbstractRequestHandler<EmptyPayload> {

	public GetConversationHandler(Model model) {
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

		if (incident_id == null || message_id == null)
			return new Answer(404);

		Optional<Message> message = model.getMessage(message_id);
		if (!message.isPresent())
			return new Answer(404);

		// validate that the logged in user is the sender or receiver (or an admin)
		DetailUser u = Main.getCurrentUser(request);
		if (!message.get().getReceiver_id().equals(u.getUuid()) &&
			!message.get().getSender_id().equals(u.getUuid()))
			return new Answer(401);

		// get the other user in the conversation
		Optional<DetailUser> partner = model.getDetailUser((message.get().getReceiver_id().equals(u.getUuid()) ?
				message.get().getSender_id() :
				message.get().getReceiver_id()));
		if (!partner.isPresent())
			return new Answer(404);

		// get the conversation
		List<Message> data = model.getConversation(incident_id, message.get().getReceiver_id(), message.get().getSender_id(), ordinal_start);
		
		return new Answer(200, dataToJson(new Conversation(data, partner.get())));
	}

}
