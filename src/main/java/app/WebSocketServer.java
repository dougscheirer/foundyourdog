package app;

import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Map;
import java.util.Optional;
import java.util.Map.Entry;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Logger;
import java.util.stream.Stream;

import org.eclipse.jetty.websocket.api.RemoteEndpoint;
import org.eclipse.jetty.websocket.api.Session;

import com.fasterxml.jackson.databind.ObjectMapper;

import app.handlers.DetailUser;

public class WebSocketServer {
	// map web sockets to a user ID (might be NULL)
	private static Map<Session, WSSessionData> websocketMap = new ConcurrentHashMap<>();
	private static Logger logger = Logger.getLogger(WebSocketServer.class.getCanonicalName());
	
	public WebSocketServer() {
		// TODO Auto-generated constructor stub
	}

	public static void addWebsocketConnection(Session user) {
		Optional<java.net.HttpCookie> sessionID = user.getUpgradeRequest().getCookies().stream()
				.filter(x -> "JSESSIONID".equals(x.getName())).findFirst();
		if (sessionID.isPresent())
			websocketMap.put(user, new WSSessionData(sessionID.get().getValue()));
	}

	public static void removeWebsocketConnection(Session user) {
		websocketMap.remove(user);
	}

	// send something to everyone
	public static void sendMessage(SocketMessage.TYPE type, String message) {
		SocketMessage msg = new SocketMessage(type, message, SocketMessage.DISPLAY_TYPE.MESSAGE, 5000);
		websocketMap.keySet().stream().filter(Session::isOpen).forEach(session -> {
			try {
				session.getRemote().sendString(msg.toJson());
			} catch (Exception e) {
				e.printStackTrace();
			}
		});
	}

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

	public static void sendPong(Session user) {
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
		try {
			entries.forEach(entry -> {
				WSSessionData s = entry.getValue();
				s.userID = user.getUuid();
				entry.setValue(s);
				sendMessage(entry.getKey().getRemote(), msg);
			});
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public static void messageReceived(Session user, String message) {
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
