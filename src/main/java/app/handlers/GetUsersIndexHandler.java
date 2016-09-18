package app.handlers;

import java.util.List;
import java.util.Map;

import app.Answer;
import app.model.Model;
import app.model.User;

public class GetUsersIndexHandler extends AbstractRequestHandler<EmptyPayload> {

	public GetUsersIndexHandler(Model model) {
		super(EmptyPayload.class, model);
		// TODO Auto-generated constructor stub
	}

	@Override
	protected Answer processImpl(EmptyPayload value, Map<String, String> urlParams, boolean shouldReturnHtml) {
		List<User> users = model.getAllUsers();
		return Answer.ok(dataToJson(users));
	}
}
