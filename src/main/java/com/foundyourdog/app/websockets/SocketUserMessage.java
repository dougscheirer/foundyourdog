package com.foundyourdog.app.websockets;

import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;

import lombok.Data;

@Data
public class SocketUserMessage {
	private String messageText;
	private int duration;
	private DISPLAY_TYPE displayType;
	public enum DISPLAY_TYPE { NONE, MESSAGE, ERROR, WARNING, SUCCESS }
	public boolean broadcast;
	
	public SocketUserMessage(String messageText, int duration, DISPLAY_TYPE displayType, boolean broadcast) {
		 this.messageText = messageText;
		 this.duration = duration;
		 this.displayType = displayType;
		 this.broadcast = broadcast;
	}

	public ObjectNode toJson() {
		JsonNodeFactory nodeFactory = JsonNodeFactory.instance;

		ObjectNode node = nodeFactory.objectNode();
		node.put("message", messageText);
		node.put("duration", duration);
		node.put("displayType", displayType.toString());
		node.put("broadcast", broadcast);
		return node;
	}
}
