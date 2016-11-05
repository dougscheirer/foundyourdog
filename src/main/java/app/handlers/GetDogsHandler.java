package app.handlers;

import java.util.List;
import java.util.Map;

import app.Answer;
import app.model.Dog;
import app.model.Model;
import app.model.User;

public class GetDogsHandler extends AbstractRequestHandler<EmptyPayload> {
	private boolean lost = false;
	
	public GetDogsHandler(boolean lost, Model model) {
		super(EmptyPayload.class, model);
		this.lost = lost; 
	}

	@Override
	protected Answer processImpl(EmptyPayload value, Map<String, String> urlParams, boolean shouldReturnHtml) {
		List<Dog> dogs = model.getAllDogs();
		return Answer.ok(dataToJson(dogs));
	}
}
