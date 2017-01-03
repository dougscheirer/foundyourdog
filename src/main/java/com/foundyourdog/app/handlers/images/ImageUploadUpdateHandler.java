package com.foundyourdog.app.handlers.images;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.sql.Timestamp;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import javax.servlet.MultipartConfigElement;
import javax.servlet.http.Part;

import com.foundyourdog.app.CloudinaryOpts;
import com.foundyourdog.app.Main;
import com.foundyourdog.app.handlers.AbstractRequestHandler;
import com.foundyourdog.app.handlers.Answer;
import com.foundyourdog.app.handlers.images.model.ImageDetail;
import com.foundyourdog.app.handlers.images.model.ImageDetailResponse;
import com.foundyourdog.app.model.Image;
import com.foundyourdog.app.model.Model;
import spark.Request;
import spark.Response;
import spark.Route;

public class ImageUploadUpdateHandler extends AbstractRequestHandler<ImageDetail> {
	private CloudinaryOpts cloudinaryOpts;

	public ImageUploadUpdateHandler(Model model, CloudinaryOpts opts) {
		super(ImageDetail.class, model);
		this.cloudinaryOpts = opts;
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
		if (!value.getUpload_location_response().startsWith("/") &&
			!value.getUpload_location_response().startsWith("https://res.cloudinary.com/" + cloudinaryOpts.getCloudName() + "/image/upload/")) {
			return new Answer(400);
		}

		// if it's a local path, this step is not required
		if (!value.getUpload_location_response().startsWith("/")) {
			dbImage.get().setImage_location(value.getUpload_location_response());
			if (!model.updateImage(dbImage.get())) {
				return new Answer(500);
			}
		}
		
		return Answer.ok(dataToJson(new ImageDetailResponse(dbImage.get())));
	}
}
