package app.handlers;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import app.Answer;
import app.Main;
import app.model.Model;
import app.model.Notification;
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
		
		Optional<Notification> notification = model.getNotification(message_id);
		if (!notification.isPresent())
			return new Answer(404);
		
		// validate that the logged in user is the sender or receiver (or an admin)
		DetailUser u = Main.getCurrentUser(request);
		if (!notification.get().getReceiver_id().equals(u.getUuid()) && 
			!notification.get().getSender_id().equals(u.getUuid())) 
			return new Answer(401);
		
		// get the other user in the conversation
		Optional<DetailUser> partner = model.getDetailUser((notification.get().getReceiver_id().equals(u.getUuid()) ?
				notification.get().getSender_id() :
				notification.get().getReceiver_id()));
		if (!partner.isPresent())
			return new Answer(404);
		
		// get the conversation
		List<Notification> data = model.getConversation(incident_id, notification.get().getReceiver_id(), notification.get().getSender_id(), ordinal_start);
		return new Answer(200, dataToJson(new Conversation(data, partner.get())));
	}

}
