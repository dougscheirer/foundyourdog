package app.handlers;

import java.util.Optional;

import com.fasterxml.jackson.databind.ObjectMapper;

import app.Answer;
import app.Main;
import app.model.Model;
import app.model.UserAuth;
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
			response.status(answer.getCode());
			response.type("application/json");
			response.body(answer.getBody());
			return answer.getBody();
		}
	}

}
