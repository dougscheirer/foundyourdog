package app.handlers;

import java.util.List;
import java.util.Map;

import app.Answer;
import app.model.Dog;
import app.model.Model;
import spark.Request;

public class GetDogsHandler extends AbstractRequestHandler<EmptyPayload> {
	public GetDogsHandler(boolean lost, Model model) {
		super(EmptyPayload.class, model);
	}

	@Override
	protected Answer processImpl(EmptyPayload value, Map<String, String> urlParams, boolean shouldReturnHtml, Request request) {
		List<Dog> dogs = model.getAllDogs();
		return Answer.ok(dataToJson(dogs));
	}
}
