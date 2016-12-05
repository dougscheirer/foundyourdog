package app.handlers;

import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketClose;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketConnect;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketMessage;
import org.eclipse.jetty.websocket.api.annotations.WebSocket;

import app.Main;
import app.WebSocketServer;

@WebSocket
public class WebsocketHandler {

	public WebsocketHandler() {
		// TODO Auto-generated constructor stub
	}

    @OnWebSocketConnect
    public void onConnect(Session user) throws Exception {
    	// TODO: add it to a map
    	WebSocketServer.addWebsocketConnection(user);
    }

    @OnWebSocketClose
    public void onClose(Session user, int statusCode, String reason) {
    	// TODO: remove it from the map
    	WebSocketServer.removeWebsocketConnection(user);
    }

    @OnWebSocketMessage
    public void onMessage(Session user, String message) {
    	WebSocketServer.messageReceived(user, message);
    }
}