package app.handlers;

import java.util.Date;
import java.util.Map;
import java.util.UUID;

import app.Answer;
import app.Main;
import app.model.Dog;
import app.model.Incident;
import app.model.IncidentForm;
import app.model.Model;
import app.model.User;
import spark.Request;

public class CreateIncidentReportHandler extends AbstractRequestHandler<IncidentForm> {
	private GetIncidentsHandler.IncidentType reportType;
	
	public CreateIncidentReportHandler(Model model, GetIncidentsHandler.IncidentType t) {
		super(IncidentForm.class, model);
		this.reportType = t;
	}

	@Override
	protected Answer processImpl(IncidentForm form, Map<String, String> urlParams, boolean shouldReturnHtml, Request request) {
		// we need to do several things:
		// 1) create a new dog for tracking purposes (TODO: make this optional
		// later)
		// 2) create an incident with the dog's ID
		// 3) change the image status (if available) to "assigned"
		
		Dog newDog = new Dog();
		Date utilDate = new java.util.Date();
		newDog.setAdded_date(new java.sql.Date(utilDate.getTime()));
		newDog.setBasic_type(form.getDog_basic_type());
		newDog.setColor(form.getDog_color());
		newDog.setGender(form.getDog_gender());
		newDog.setIntact(form.getDog_breeding_status() == "intact");
		newDog.setName(form.getDog_name());
		newDog.setImage_id(form.getPhoto_id());
		
		String dogId = model.createDog(newDog);
		if (dogId == null) {
			return new Answer(500);
		}
		Incident incident = new Incident();
		incident.setDog_id(dogId);
		incident.setIncident_date(form.getIncident_date());
		incident.setMap_latitude(form.getMap_latitude());
		incident.setMap_longitude(form.getMap_longitude());
		incident.setReporter_id(Main.getCurrentUser(request).getUuid());
		incident.setState(this.reportType == GetIncidentsHandler.IncidentType.LOST ? "lost" : "found");
		
		String incidentId = model.createIncident(incident);
		if (incidentId == null) {
			return new Answer(500);
		}
		
		// book-keeping, change the image status
		if (form.getPhoto_id() != null) {
			model.updateImageStatus(form.getPhoto_id(), dogId, "assigned to " + dogId);
		} else {
			// log a message
		}
		
		return new Answer(200, "{\"id\":\"" + incidentId + "\"}");
	}
}
