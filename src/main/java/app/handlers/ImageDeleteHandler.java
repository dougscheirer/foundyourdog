package app.handlers;

import java.io.FileInputStream;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;

import javax.servlet.http.HttpServletResponse;

import app.Answer;
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
		String imageID = request.params(":id");
		Optional<Image> image = model.getImage(imageID);

		// delete the image file
		Path path = Paths.get(image.get().getImage_location() + "/" + imageID);
		Files.delete(path);
		// clean up the DB
		model.deleteImage(imageID);
		return new Answer(200);
	}
}
