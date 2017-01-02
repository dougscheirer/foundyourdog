package com.foundyourdog.app.handlers;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.sql.Timestamp;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import javax.servlet.MultipartConfigElement;
import javax.servlet.http.Part;

import com.foundyourdog.app.Main;
import com.foundyourdog.app.model.Image;
import com.foundyourdog.app.model.Model;
import spark.Request;
import spark.Response;
import spark.Route;

public class ImageUploadUpdateHandler implements Route {
	
	private Model model;
	
	public ImageUploadUpdateHandler(Model model) {
		this.model = model;
	}
	
	@Override
	public Object handle(Request request, Response response) throws Exception {
		// we need to record the URL to where the file is, either us (dev) or cloudinary (prod)
		// the ID is in the request
		String id = request.params("id");
		Optional<Image> dbImage = model.getImage(id);
		if (dbImage.get() == null) {
			response.status(500);
			response.body("Server error");
			return response.body();
		}
		
		// validate that the current user is the owner of the db object
		if (Main.getCurrentUser(request).getUuid() != dbImage.get().getUser_id()) {
			response.status(401);
			response.body("Forbidden");
			return response.body();
		}
		
		// validate that it's either us or cloudinary
		return response.body();
	}

}
