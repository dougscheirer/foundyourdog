package com.foundyourdog.app.handlers.incidents;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.foundyourdog.app.Main;
import com.foundyourdog.app.handlers.AbstractRequestHandler;
import com.foundyourdog.app.handlers.Answer;
import com.foundyourdog.app.handlers.EmptyPayload;
import com.foundyourdog.app.handlers.images.model.ImageDetailResponse;
import com.foundyourdog.app.handlers.incidents.model.ReportDetail;
import com.foundyourdog.app.handlers.incidents.model.ContactUser;
import com.foundyourdog.app.handlers.users.model.DetailUser;
import com.foundyourdog.app.model.Dog;
import com.foundyourdog.app.model.Image;
import com.foundyourdog.app.model.Incident;
import com.foundyourdog.app.model.Model;

import spark.Request;

public class GetIncidentContactsHandler extends AbstractRequestHandler<EmptyPayload> {

	public GetIncidentContactsHandler(Model model) {
		super(EmptyPayload.class, model);
	}

	@Override
	protected Answer processImpl(EmptyPayload value, Map<String, String> urlParams, boolean shouldReturnHtml, Request request) {
		String reportID = request.queryParams("incident");
		DetailUser currentUser = Main.getCurrentUser(request);
		if (currentUser == null) {
			return new Answer(403);
		}
		List<ContactUser> contacts = model.getContactList(reportID, currentUser.getUuid());
		// return a list of userID + handles
		return new Answer(200, dataToJson(contacts));
	}
}
