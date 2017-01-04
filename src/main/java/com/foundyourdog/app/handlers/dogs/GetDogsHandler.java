package com.foundyourdog.app.handlers.dogs;

import java.util.List;
import java.util.Map;

import com.foundyourdog.app.handlers.AbstractRequestHandler;
import com.foundyourdog.app.handlers.Answer;
import com.foundyourdog.app.handlers.EmptyPayload;
import com.foundyourdog.app.model.Dog;
import com.foundyourdog.app.model.Model;
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
