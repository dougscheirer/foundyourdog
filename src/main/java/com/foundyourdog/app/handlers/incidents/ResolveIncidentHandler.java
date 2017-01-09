package com.foundyourdog.app.handlers.incidents;

import java.util.Map;
import java.util.Optional;

import com.foundyourdog.app.handlers.AbstractRequestHandler;
import com.foundyourdog.app.handlers.Answer;
import com.foundyourdog.app.handlers.EmptyPayload;
import com.foundyourdog.app.handlers.images.model.ImageDetailResponse;
import com.foundyourdog.app.handlers.incidents.model.ReportDetail;
import com.foundyourdog.app.handlers.incidents.model.ResolveData;
import com.foundyourdog.app.model.Dog;
import com.foundyourdog.app.model.Image;
import com.foundyourdog.app.model.Incident;
import com.foundyourdog.app.model.Model;

import spark.Request;

public class ResolveIncidentHandler extends AbstractRequestHandler<ResolveData> {

	public ResolveIncidentHandler(Model model) {
		super(ResolveData.class, model);
	}

	@Override
	protected Answer processImpl(ResolveData value, Map<String, String> urlParams, boolean shouldReturnHtml, Request request) {
		String reportID = urlParams.get(":id");
		
		model.resolveIncident(reportID, value);
		return Answer.ok("worked");
	}
}
