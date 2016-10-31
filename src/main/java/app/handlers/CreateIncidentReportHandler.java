package app.handlers;

import java.util.Map;
import java.util.UUID;

import app.Answer;
import app.model.Incident;
import app.model.Model;
import app.model.User;

public class CreateIncidentReportHandler extends AbstractRequestHandler<Incident> {
	public CreateIncidentReportHandler(Model model, GetIncidentsHandler.IncidentType t) {
		super(Incident.class, model);
	// TODO Auto-generated constructor stub
}

	@Override
	protected Answer processImpl(Incident value, Map<String, String> urlParams, boolean shouldReturnHtml) {
		// TODO: create a hash of the password in password_hash
		// TODO: validate the User data before the attempt
		// create a confirmation token
		return new Answer(200);
	}
}
