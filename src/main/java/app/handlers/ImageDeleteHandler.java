package app.handlers;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;

import app.Answer;
import app.Main;
import app.model.Image;
import app.model.Model;
import spark.Request;
import spark.Response;
import spark.Route;

public class ImageDeleteHandler implements Route {
	private Model model;

	public ImageDeleteHandler(Model model) {
		this.model = model;
	}

	@Override
	public Object handle(Request request, Response response) throws Exception {
		DetailUser u = Main.getCurrentUser(request);
		if (u == null) {
			return new Answer(403);
		}
		
		String imageID = request.params(":id");
		Optional<Image> image = model.getImage(imageID);
		// make sure they are authorized to delete it
		if (image.get() == null) {
			return new Answer(404);
		}
		if (image.get().getUser_id() != u.getUuid() && !u.getAdmin()) {
			return new Answer(403);
		}
		
		// delete the image file
		Path path = Paths.get(image.get().getImage_location() + "/" + imageID);
		Files.delete(path);
		// clean up the DB
		model.deleteImage(imageID);
		return new Answer(200);
	}
}
