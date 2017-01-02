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

import com.foundyourdog.app.Answer;
import com.foundyourdog.app.Main;
import com.foundyourdog.app.model.Image;
import com.foundyourdog.app.model.ImageDetail;
import com.foundyourdog.app.model.ImageDetailResponse;
import com.foundyourdog.app.model.Model;
import spark.Request;
import spark.Response;
import spark.Route;

public class ImageUploadUpdateHandler extends AbstractRequestHandler<ImageDetail> {
	private String cloudinaryCloudID;
	
	public ImageUploadUpdateHandler(Model model, String cloudinaryCloudID) {
		super(ImageDetail.class, model);
		this.cloudinaryCloudID = cloudinaryCloudID;
	}
	
	@Override
	protected Answer processImpl(ImageDetail value, Map<String, String> urlParams, boolean shouldReturnHtml,
			Request request) {
		// we need to record the URL to where the file is, either us (dev) or cloudinary (prod)
		// the ID is in the request
		String id = request.params(":id");
		Optional<Image> dbImage = model.getImage(id);
		if (dbImage.get() == null) {
			return new Answer(400); // bad request
		}
		
		// validate that the current user is the owner of the db object
		if (!Main.getCurrentUser(request).getUuid().equals(dbImage.get().getUser_id())) {
			return new Answer(401); // forbidden
		}
		
		// validate that the location is either a local path or cloudinary
		// location should be either /:id or start with https://res.cloudinary.com/:cloud_id/image/upload/...
		if (!value.getImageLocation().startsWith("/") && 
			!value.getImageLocation().startsWith("https://res.cloudinary.com/" + cloudinaryCloudID + "/image/upload/")) {
			return new Answer(400);
		}

		dbImage.get().setImage_location(value.getImageLocation());
		if (!model.updateImage(dbImage.get())) {
			return new Answer(500);
		}

		return Answer.ok(dataToJson(new ImageDetailResponse(dbImage.get())));
	}

}
