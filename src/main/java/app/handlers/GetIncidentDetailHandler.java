package app.handlers;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import app.Answer;
import app.model.Dog;
import app.model.Image;
import app.model.Incident;
import app.model.Model;
import app.model.ReportDetail;
import app.model.User;
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
			details.setImage(img.get());
		}
		return new Answer(200, dataToJson(details));
	}
}
