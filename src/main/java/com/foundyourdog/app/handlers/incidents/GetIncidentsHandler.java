package com.foundyourdog.app.handlers.incidents;

import java.util.List;
import java.util.Map;

import com.foundyourdog.app.handlers.AbstractRequestHandler;
import com.foundyourdog.app.handlers.Answer;
import com.foundyourdog.app.handlers.EmptyPayload;
import com.foundyourdog.app.handlers.incidents.model.IncidentBrief;
import com.foundyourdog.app.model.Model;
import spark.Request;

public class GetIncidentsHandler extends AbstractRequestHandler<EmptyPayload> {
	private boolean lost = false;
	
	public enum IncidentType {
		LOST,
		FOUND
	}
	public GetIncidentsHandler(IncidentType type, Model model) {
		super(EmptyPayload.class, model);
		this.lost = (type == IncidentType.LOST) ? true : false; 
	}

	@Override
	protected Answer processImpl(EmptyPayload value, Map<String, String> urlParams, boolean shouldReturnHtml, Request request) {
		List<IncidentBrief> incidents = model.getAllIncidents(lost);
		return Answer.ok(dataToJson(incidents));
	}
}
