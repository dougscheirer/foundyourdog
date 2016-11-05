package app.handlers;

import java.util.Map;

import app.Answer;
import app.model.Model;
import spark.Request;
import spark.Response;
import spark.Route;

public class AuthenticatedHandler extends AbstractRequestHandler<EmptyPayload> {

	public AuthenticatedHandler(Model model) {
		super(EmptyPayload.class, model);
	}

	@Override
	protected Answer processImpl(EmptyPayload value, Map<String, String> urlParams, boolean shouldReturnHtml) {
		// TODO Auto-generated method stub
		return null;
	}

}
