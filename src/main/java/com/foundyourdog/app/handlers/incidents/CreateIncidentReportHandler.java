package com.foundyourdog.app.handlers.incidents;

import java.sql.Timestamp;
import java.util.Map;

import com.foundyourdog.app.Main;
import com.foundyourdog.app.handlers.AbstractRequestHandler;
import com.foundyourdog.app.handlers.Answer;
import com.foundyourdog.app.handlers.incidents.GetIncidentsHandler.IncidentType;
import com.foundyourdog.app.handlers.incidents.model.IncidentForm;
import com.foundyourdog.app.model.Dog;
import com.foundyourdog.app.model.Incident;
import com.foundyourdog.app.model.Model;
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
		newDog.setAdded_date(new Timestamp(System.currentTimeMillis()));
		newDog.setPrimary_type(form.getDog_primary_type());
		newDog.setSecondary_type(form.getDog_secondary_type());
		newDog.setPrimary_color(form.getDog_primary_color());
		newDog.setSecondary_color(form.getDog_secondary_color());
		newDog.setCoat_type(form.getDog_coat_type());
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
