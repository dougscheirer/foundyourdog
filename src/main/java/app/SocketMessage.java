package app;

import app.handlers.AbstractRequestHandler;
import lombok.Data;

@Data
public class SocketMessage {
	private String messageText;
	private TYPE type;
	private int duration;
	private DISPLAY_TYPE displayType;
	
	public enum TYPE { PING, PONG, REGISTER, USER_MESSAGE, BROADCAST_MESSAGE }
	public enum DISPLAY_TYPE { NONE, MESSAGE, ERROR, WARNING, SUCCESS }
	
	public SocketMessage(TYPE type, String messageText, DISPLAY_TYPE displayType, int duration) {
		 this.messageText = messageText;
		 this.type = type;
		 this.duration = duration;
		 this.displayType = displayType;
	}
	
	public String toJson() {
		return AbstractRequestHandler.dataToJson(this);
	}
	
	public SocketMessage() {
		// dummy constructor
	}
}
