package com.foundyourdog.app;

import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;

import lombok.Data;

@Data
public class SocketNotificationMessage {
	private String messageID;
	private String incidentID;
	private String receiverID;
	private String fromHandle;
	private int unreadMessages;

	public SocketNotificationMessage(String receiverID, String incidentID, String messageID, String fromHandle, int unreadMessages) {
		 this.messageID = messageID;
		 this.incidentID = incidentID;
		 this.fromHandle = fromHandle;
		 this.receiverID = receiverID;
		 this.unreadMessages = unreadMessages;
	}

	public ObjectNode toJson() {
		JsonNodeFactory nodeFactory = JsonNodeFactory.instance;

		ObjectNode node = nodeFactory.objectNode();
		if (messageID != null) node.put("messageID", messageID);
		if (incidentID != null) node.put("incidentID", incidentID);
		node.put("receiverID", receiverID);
		if (fromHandle != null) node.put("fromHandle", fromHandle);
		node.put("unread", unreadMessages);
		return node;
	}
}
