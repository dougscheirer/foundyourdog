package com.foundyourdog.app.handlers;

import java.util.Map;
import java.util.Optional;

import com.foundyourdog.app.Answer;
import com.foundyourdog.app.model.Dog;
import com.foundyourdog.app.model.Image;
import com.foundyourdog.app.model.ImageDetailResponse;
import com.foundyourdog.app.model.Incident;
import com.foundyourdog.app.model.Model;
import com.foundyourdog.app.model.ReportDetail;
import spark.Request;

public class GetIncidentDetailHandler extends AbstractRequestHandler<EmptyPayload> {

	public GetIncidentDetailHandler(Model model) {
		super(EmptyPayload.class, model);
	}

	@Override
	protected Answer processImpl(EmptyPayload value, Map<String, String> urlParams, boolean shouldReturnHtml, Request request) {
		String reportID = urlParams.get(":id");
		// return everything required for the report, the report itself, the dog info, and the image info
		ReportDetail details = new ReportDetail();
		Optional<Incident> i = model.getIncident(reportID);
		Optional<Dog> d = null;
		Optional<Image> img = null;
		
		if (i.isPresent()) {
			d = model.getDog(i.get().getDog_id());	
		}
		
		if (d.isPresent()) {
			img = model.getImage(d.get().getImage_id());
		}

		if (!i.isPresent() || !d.isPresent()) {
			return new Answer(404, "Could not find " + reportID);
		} 
		
		details.setIncident(i.get());
		details.setDog(d.get());
		if (img.isPresent()) {
			details.setImage(new ImageDetailResponse(img.get()));
		}
		return new Answer(200, dataToJson(details));
	}
}
