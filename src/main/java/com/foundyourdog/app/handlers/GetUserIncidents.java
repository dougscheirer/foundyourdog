package com.foundyourdog.app.handlers;

import java.util.List;
import java.util.Map;

import com.foundyourdog.app.Answer;
import com.foundyourdog.app.Main;
import com.foundyourdog.app.model.Model;
import com.foundyourdog.app.model.IncidentBrief;
import spark.Request;

public class GetUserIncidents extends AbstractRequestHandler<EmptyPayload> {

	public GetUserIncidents(Model model) {
		super(EmptyPayload.class, model);
	}

	@Override
	protected Answer processImpl(EmptyPayload value, Map<String, String> urlParams, boolean shouldReturnHtml, Request request) {
		DetailUser u = Main.getCurrentUser(request);
		if (u == null) {
			return new Answer(401);
		}
		List<IncidentBrief> incidents = model.getUserIncidents(u.getUuid(), request.queryParams("type").toString());
		return Answer.ok(dataToJson(incidents));
	}
}