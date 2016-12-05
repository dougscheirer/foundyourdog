package app.handlers;

import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketClose;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketConnect;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketMessage;
import org.eclipse.jetty.websocket.api.annotations.WebSocket;

import app.Main;

@WebSocket
public class WebsocketHandler {

	public WebsocketHandler() {
		// TODO Auto-generated constructor stub
	}

    @OnWebSocketConnect
    public void onConnect(Session user) throws Exception {
    	// TODO: add it to a map
    	Main.addWebsocketConnection(user);
    }

    @OnWebSocketClose
    public void onClose(Session user, int statusCode, String reason) {
    	// TODO: remove it from the map
    	Main.removeWebsocketConnection(user);
    }

    @OnWebSocketMessage
    public void onMessage(Session user, String message) {
        Main.messageReceived(user, message);
    }
}