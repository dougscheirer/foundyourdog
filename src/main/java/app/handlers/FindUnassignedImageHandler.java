package app.handlers;

import java.util.Optional;

import app.Main;
import app.model.Image;
import app.model.Model;
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
		response.body(AbstractRequestHandler.dataToJson(image.get()));
		return response.body();
	}
}
