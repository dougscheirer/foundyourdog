package app.handlers;

import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.Map.Entry;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Logger;
import java.util.stream.Stream;

import org.eclipse.jetty.websocket.api.RemoteEndpoint;
import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketClose;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketConnect;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketMessage;
import org.eclipse.jetty.websocket.api.annotations.WebSocket;

import com.fasterxml.jackson.databind.ObjectMapper;

import app.SocketMessage;
import app.WSSessionData;

@WebSocket
public class WebsocketHandler {

	private static Map<Session, WSSessionData> websocketMap = new ConcurrentHashMap<>();
	private static Logger logger = Logger.getLogger(WebsocketHandler.class.getCanonicalName());
	
	public WebsocketHandler() {
		// TODO Auto-generated constructor stub
	}

    @OnWebSocketConnect
	public void onConnect(Session user) throws Exception {
    	// generate a UUID for this session, the client will use it in other auth attempts
		String uuid = UUID.randomUUID().toString();
    	logger.severe("Connection for " + uuid);
		websocketMap.put(user, new WSSessionData(uuid));
		SocketMessage msg = new SocketMessage(SocketMessage.TYPE.REGISTER, uuid, SocketMessage.DISPLAY_TYPE.NONE, 0);
		sendMessage(user.getRemote(), msg);
	}

    @OnWebSocketClose
    public void onClose(Session user, int statusCode, String reason) {
		websocketMap.remove(user);
	}

	// send something to everyone
	public void sendMessage(SocketMessage.TYPE type, String message) {
		SocketMessage msg = new SocketMessage(type, message, SocketMessage.DISPLAY_TYPE.MESSAGE, 5000);
		websocketMap.keySet().stream().filter(Session::isOpen).forEach(session -> {
			try {
				session.getRemote().sendString(msg.toJson());
			} catch (Exception e) {
				e.printStackTrace();
			}
		});
	}

	// send something to an endpoint
	public static void sendMessage(RemoteEndpoint remoteEndpoint, SocketMessage msg) {
		try {
			remoteEndpoint.sendString(msg.toJson());
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	// send something to a user
	public static void sendMessage(String receiver_id, String message) {
		SocketMessage msg = new SocketMessage(SocketMessage.TYPE.USER_MESSAGE, message,
				SocketMessage.DISPLAY_TYPE.MESSAGE, 5000);
		websocketMap.entrySet().stream().filter(map -> map.getKey().isOpen())
				.filter(map -> receiver_id.equals(map.getValue().getUserID())).forEach(entry -> {
					sendMessage(entry.getKey().getRemote(), msg);
				});
	}

	public void sendPong(Session user) {
		SocketMessage msg = new SocketMessage(SocketMessage.TYPE.PONG, null, SocketMessage.DISPLAY_TYPE.NONE, 0);
		try {
			user.getRemote().sendString(msg.toJson());
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public static void updateWebsocketMap(String cookie, DetailUser user) {
		SocketMessage msg = new SocketMessage(SocketMessage.TYPE.USER_MESSAGE, "Your websocket entry was updated",
				SocketMessage.DISPLAY_TYPE.MESSAGE, 5000);
		Stream<Entry<Session, WSSessionData>> entries = websocketMap.entrySet().stream()
				.filter(map -> map.getKey().isOpen()).filter(map -> map.getValue().sessionID.equals(cookie));
		logger.severe("request modified entry for " + cookie + "/" + user.getHandle());
		try {
			entries.forEach(entry -> {
				WSSessionData s = entry.getValue();
				s.userID = user.getUuid();
				entry.setValue(s);
				sendMessage(entry.getKey().getRemote(), msg);
				logger.severe("modified entry for " + cookie + "/" + user.getHandle()); 
			});
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

   @OnWebSocketMessage
 	public void onMessage(Session user, String message) {
		try {
			ObjectMapper objectMapper = new ObjectMapper();
			// set the date format for our app
			DateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			objectMapper.setDateFormat(df);
			SocketMessage msg;
			msg = objectMapper.readValue(message, SocketMessage.class);
			switch (msg.getType()) {
			case PING:
				sendPong(user);
				break;
			case USER_MESSAGE: // for debugging
				sendMessage(msg.getType(), msg.getMessageText());
				break;
			case BROADCAST_MESSAGE: // for debugging
				sendMessage(msg.getType(), msg.getMessageText());
				break;
			default:
				logger.severe("Received unhandled message type:");
				logger.severe(message);
				break;
			}
		} catch (IOException e) {
			logger.severe(e.getMessage());
		}
	}
}