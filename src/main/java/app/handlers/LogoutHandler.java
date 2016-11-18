package app.handlers;

import app.Main;
import app.model.Model;
import spark.Request;
import spark.Response;
import spark.Route;

public class LogoutHandler implements Route {

	public LogoutHandler(Model model) {
	}

	@Override
	public Object handle(Request request, Response response) throws Exception {
		request.session().removeAttribute(Main.SESSION_USERID);
		response.status(200);
		return "OK";
	}
}
