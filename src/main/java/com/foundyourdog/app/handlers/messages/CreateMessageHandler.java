package com.foundyourdog.app.handlers.messages;

import java.sql.Timestamp;
import java.util.Map;
import java.util.Optional;

import com.foundyourdog.app.Main;
import com.foundyourdog.app.handlers.AbstractRequestHandler;
import com.foundyourdog.app.handlers.Answer;
import com.foundyourdog.app.handlers.WebsocketHandler;
import com.foundyourdog.app.handlers.users.model.DetailUser;
import com.foundyourdog.app.model.Incident;
import com.foundyourdog.app.model.Model;
import com.foundyourdog.app.model.Message;

import spark.Request;

public class CreateMessageHandler extends AbstractRequestHandler<Message> {

	public CreateMessageHandler(Model model) {
		super(Message.class, model);
	}

	@Override
	protected Answer processImpl(Message value, Map<String, String> urlParams, boolean shouldReturnHtml, Request request) {
		DetailUser u = Main.getCurrentUser(request);
		if (u == null) {
			return new Answer(401);
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
		String messageId = model.createMessage(value);
		if (messageId == null) {
			return new Answer(500);
		}
		Optional<DetailUser> from = model.getDetailUser(value.getSender_id());
		if (from == null) {
			return new Answer(500);
		}
		// send a websocket message to the target and the source
		WebsocketHandler.notifyNewMessage(value.getSender_id(), i.get().getUuid(), messageId, from.get().getHandle(), -1);
		WebsocketHandler.notifyNewMessage(value.getReceiver_id(), i.get().getUuid(), messageId, from.get().getHandle(), model.getUnreadMessages(value.getReceiver_id()));
		// TODO: um, make an object?
		return new Answer(200, "{\"id\":\"" + messageId + "\"}");
	}
}