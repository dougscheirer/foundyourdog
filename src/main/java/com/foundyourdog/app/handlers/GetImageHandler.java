package com.foundyourdog.app.handlers;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;

import javax.servlet.http.HttpServletResponse;

import com.foundyourdog.app.model.Image;
import com.foundyourdog.app.model.Model;
import spark.Request;
import spark.Response;
import spark.Route;

public class GetImageHandler implements Route {
	private Model model;

	public GetImageHandler(Model model) {
		this.model = model;
	}

	@Override
	public Object handle(Request request, Response response) throws Exception {
		Optional<Image> img = model.getImage(request.params(":id"));
		if (!img.isPresent()) {
			response.status(404);
			response.body("Could not find image " + request.params(":id"));
			return response.body();
		}

		Path path = Paths.get(img.get().getImage_location() + "/" + img.get().getUuid());
		byte[] data = null;
		try {
			data = Files.readAllBytes(path);
		} catch (Exception e1) {
			e1.printStackTrace();
		}

		HttpServletResponse raw = response.raw();
		response.header("Content-Disposition", "attachment; filename=image.jpg");
		response.type("application/force-download");
		try {
			raw.getOutputStream().write(data);
			raw.getOutputStream().flush();
			raw.getOutputStream().close();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return raw;
	}
}
