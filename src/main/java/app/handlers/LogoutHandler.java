package app.handlers;

import java.util.Map;

import app.Answer;
import app.model.Model;
import spark.Request;
import spark.Response;
import spark.Route;

public class LogoutHandler implements Route {
	private String sessionKey;
	private Model model;

	public LogoutHandler(Model model, String sessionKey) {
		this.model = model;
		this.sessionKey = sessionKey;
	}

	@Override
	public Object handle(Request request, Response response) throws Exception {
		request.session().removeAttribute(this.sessionKey);
		return null;
	}
}
