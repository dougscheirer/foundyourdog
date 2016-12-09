package app;

import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;

import app.handlers.AbstractRequestHandler;
import lombok.Data;

@Data
public class SocketMessage {
	private TYPE type;
	private ObjectNode data;

	// ping/pong are keepalives
	// register is for handshake
	// user message is a SocketUserMessage (popups)

	public enum TYPE {
		PING, PONG, REGISTER, USER_MESSAGE, NEW_MESSAGE
	}

	public SocketMessage(TYPE type, ObjectNode jsondata) {
		this.type = type;
		this.data = jsondata;
	}

	public SocketMessage(TYPE type, String id, String data) {
		this.type = type;
		JsonNodeFactory nodeFactory = JsonNodeFactory.instance;

		this.data = nodeFactory.objectNode();
		this.data.put(id, data);
	}

	public String toJson() {
		return AbstractRequestHandler.dataToJson(this);
	}

	public SocketMessage() {
		// dummy constructor
	}
}
