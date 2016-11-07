package app.handlers;

import java.util.Map;
import java.util.Optional;

import app.Answer;
import app.Main;
import app.model.Model;
import spark.Request;
import spark.Response;
import spark.Route;

public class AuthenticatedHandler implements Route {
	private final Model model;
	
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
			return answer.getBody();
		}
	}
}
