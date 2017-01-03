package com.foundyourdog.app.handlers.images;

import java.nio.file.Files;
import java.nio.file.NoSuchFileException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.foundyourdog.app.Main;
import com.foundyourdog.app.handlers.Answer;
import com.foundyourdog.app.handlers.users.model.DetailUser;
import com.foundyourdog.app.model.Image;
import com.foundyourdog.app.model.Model;
import spark.Request;
import spark.Response;
import spark.Route;

public class ImageDeleteHandler implements Route {
	private Model model;
	final static Logger logger = LoggerFactory.getLogger(Main.class);

	public ImageDeleteHandler(Model model) {
		this.model = model;
	}

	@Override
	public Object handle(Request request, Response response) throws Exception {
		DetailUser u = Main.getCurrentUser(request);
		if (u == null) {
			return new Answer(401);
		}

		String imageID = request.params(":id");
		Optional<Image> image = model.getImage(imageID);
		// make sure they are authorized to delete it
		if (image.get() == null) {
			return new Answer(404);
		}
		if (!image.get().getUser_id().equals(u.getUuid()) && !u.isAdmin()) {
			return new Answer(403); // you are forbidden
		}

		// delete the image file
		Path path = Paths.get(image.get().getImage_location() + "/" + imageID);
		try {
			Files.delete(path);
		} catch (NoSuchFileException e) {
			logger.info(e.getMessage());
		}
		// clean up the DB
		model.deleteImage(imageID);
		return new Answer(200);
	}
}
