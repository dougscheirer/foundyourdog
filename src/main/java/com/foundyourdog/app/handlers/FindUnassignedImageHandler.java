package com.foundyourdog.app.handlers;

import java.util.Optional;

import com.foundyourdog.app.Main;
import com.foundyourdog.app.model.Image;
import com.foundyourdog.app.model.ImageDetailResponse;
import com.foundyourdog.app.model.Model;
import spark.Request;
import spark.Response;
import spark.Route;

public class FindUnassignedImageHandler implements Route {
	private Model model;

	public FindUnassignedImageHandler(Model model) {
		this.model = model;
	}

	@Override
	public Object handle(Request request, Response response) throws Exception {
		// requires the current user
		DetailUser user = Main.getCurrentUser(request);
		if (user == null) {
			response.status(401);
			response.body("Unauthenticated");
			return response.body();
		}
		
		Optional<Image> image = model.getUnassignedImage(user.getUuid());
		if (!image.isPresent()) {
			response.status(200);
			response.body("{}");
			return response.body();
		}
		
		response.status(200);
		ImageDetailResponse idr = new ImageDetailResponse(image.get());
		idr.setImageUrl(request, image.get().getImage_location());
		response.body(AbstractRequestHandler.dataToJson(idr));
		return response.body();
	}
}
