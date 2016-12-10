package app;

import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;

import app.handlers.AbstractRequestHandler;
import lombok.Data;

@Data
public class SocketNotificationMessage {
	private String messageID;
	private String incidentID;
	private String receiverID;
	private String fromHandle;
	
	public SocketNotificationMessage(String receiverID, String incidentID, String messageID, String fromHandle) {
		 this.messageID = messageID;
		 this.incidentID = incidentID;
		 this.fromHandle = fromHandle;
		 this.receiverID = receiverID;
	}

	public ObjectNode toJson() {
		JsonNodeFactory nodeFactory = JsonNodeFactory.instance;

		ObjectNode node = nodeFactory.objectNode();
		node.put("messageID", messageID);
		node.put("incidentID", incidentID);
		node.put("receiverID", receiverID);
		node.put("fromHandle", fromHandle);
		return node;
	}
}
