package app.handlers;

import java.util.List;
import java.util.Map;

import app.Answer;
import app.model.Dog;
import app.model.Incident;
import app.model.Model;
import app.model.User;

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
	protected Answer processImpl(EmptyPayload value, Map<String, String> urlParams, boolean shouldReturnHtml) {
		List<Incident> users = model.getAllIncidents(lost);
		return Answer.ok(dataToJson(users));
	}
}
