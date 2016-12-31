package com.foundyourdog.app.handlers;

import java.util.Optional;

import com.fasterxml.jackson.databind.ObjectMapper;

import com.foundyourdog.app.Answer;
import com.foundyourdog.app.Main;
import com.foundyourdog.app.handlers.WebsocketHandler;
import com.foundyourdog.app.model.Model;
import com.foundyourdog.app.model.UserAuth;
import spark.Request;
import spark.Response;
import spark.Route;

public class LoginHandler implements Route {
	private Model model;

	public LoginHandler(Model model) {
		this.model = model;
	}

	@Override
	public Object handle(Request request, Response response) throws Exception {
		ObjectMapper objectMapper = new ObjectMapper();
		UserAuth auth = objectMapper.readValue(request.body(), UserAuth.class);

		Optional<DetailUser> user = model.authenticateUser(auth.getUser(), auth.getPassword());
		if (!user.isPresent()) {
			response.status(401);
			response.body("Password incorrect");
			return response.body();
		} else {
			Answer answer = Answer.ok(AbstractRequestHandler.dataToJson(user.get()));
			request.session().attribute(Main.SESSION_USERID, user.get());
			WebsocketHandler.updateWebsocketMap(request.cookie("ws"), user.get());
			WebsocketHandler.sendUnreadMessages(user.get().getUuid(), model.getUnreadMessages(user.get().getUuid()));
			response.status(answer.getCode());
			response.type("application/json");
			response.body(answer.getBody());
			return answer.getBody();
		}
	}

}
