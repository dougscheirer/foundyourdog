package app.handlers;

import app.Answer;
import app.Main;
import app.model.Model;
import spark.Request;
import spark.Response;
import spark.Route;

public class AuthenticatedHandler implements Route {
	
	public AuthenticatedHandler(Model model) {
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
			Main.updateWebsocketMap(request.cookie("JSESSIONID"), user);
			return answer.getBody();
		}
	}
}
