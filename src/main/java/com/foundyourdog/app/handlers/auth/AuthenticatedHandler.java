package com.foundyourdog.app.handlers.auth;

import com.foundyourdog.app.Main;
import com.foundyourdog.app.handlers.AbstractRequestHandler;
import com.foundyourdog.app.handlers.Answer;
import com.foundyourdog.app.handlers.WebsocketHandler;
import com.foundyourdog.app.handlers.users.model.DetailUser;
import com.foundyourdog.app.model.Model;
import spark.Request;
import spark.Response;
import spark.Route;

public class AuthenticatedHandler implements Route {
	private Model model;
	
	public AuthenticatedHandler(Model model) {
		this.model = model;
	}

	@Override
	public Object handle(Request request, Response response) throws Exception {
		DetailUser user = Main.getCurrentUser(request);
		if (user == null) {
			response.status(401);
			response.body("Not authenticated");
			return response.body();
		} else {
			Answer answer = Answer.ok(AbstractRequestHandler.dataToJson(user));
			response.status(answer.getCode());
			response.type("application/json");
			response.body(answer.getBody());
			WebsocketHandler.updateWebsocketMap(request.cookie("ws"), user);
			WebsocketHandler.sendUnreadMessages(user.getUuid(), model.getUnreadMessages(user.getUuid()));
			return answer.getBody();
		}
	}
}
