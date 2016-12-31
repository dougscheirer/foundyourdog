package com.foundyourdog.app.handlers;

import com.foundyourdog.app.Main;
import com.foundyourdog.app.model.Model;
import spark.Request;
import spark.Response;
import spark.Route;

public class LogoutHandler implements Route {

	public LogoutHandler(Model model) {
	}

	@Override
	public Object handle(Request request, Response response) throws Exception {
		DetailUser u = Main.getCurrentUser(request);
		request.session().removeAttribute(Main.SESSION_USERID);
		WebsocketHandler.removeUserFromMap(request.cookie("ws"), u);
		response.status(200);
		return "OK";
	}
}
