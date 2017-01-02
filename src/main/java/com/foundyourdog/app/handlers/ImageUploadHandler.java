package com.foundyourdog.app.handlers;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.sql.Timestamp;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.MultipartConfigElement;
import javax.servlet.http.Part;

import com.cloudinary.Cloudinary;
import com.foundyourdog.app.Main;
import com.foundyourdog.app.model.Image;
import com.foundyourdog.app.model.Model;
import spark.Request;
import spark.Response;
import spark.Route;

public class ImageUploadHandler implements Route {
	
	private Model model;
	private String imageLocation;
	private String cloudinarySecret;
	private String cloudinaryUrl;
	private String cloudinaryApiKey;
	
	public ImageUploadHandler(Model model, String imageLocation, String cloudinarySecret, String cloudinaryUrl, String cloudinaryApiKey) {
		this.model = model;
		this.imageLocation = imageLocation;
		this.cloudinarySecret = cloudinarySecret;
		this.cloudinaryUrl = cloudinaryUrl;
		this.cloudinaryApiKey = cloudinaryApiKey;
	}
	
	private boolean usingCloudinary() {
		return !this.cloudinarySecret.isEmpty();
	}
	
	@Override
	public Object handle(Request request, Response response) throws Exception {
		// first create the DB entry, then save the file
		Image newImage = new Image();
		newImage.setUser_id(Main.getCurrentUser(request).getUuid());
		newImage.setUpload_date(new Timestamp(System.currentTimeMillis()));
		newImage.setStatus("unassigned");

		// TODO: if it's not part of a report, it will have a dog id (probably)
		String uuid = model.createImage(newImage);
		if (uuid == null) {
			response.status(500);
			response.body("Error trying to create upload entry");
			return response.body();
		}
		
		Image dbImage = model.getImage(uuid).get();

		if (usingCloudinary()) {
			Cloudinary cloudinary = new Cloudinary();
			// create a list of options for the upload
			Map<String, Object> map = new HashMap<String, Object>();
			map.put("timestamp", newImage.getUpload_date().getTime());
			map.put("public_id", newImage.getUuid());
			// sign them
			String signature = cloudinary.apiSignRequest(map, this.cloudinarySecret);
			// return the data for the browser to do the work
			response.status(200);
			dbImage.setUploadSignature(signature);
			dbImage.setUploadUrl(this.cloudinaryUrl);
			dbImage.setApiKey(this.cloudinaryApiKey);
			response.body(AbstractRequestHandler.dataToJson(dbImage));
		} else {
			dbImage.setUploadSignature(dbImage.getUuid());
			dbImage.setUploadUrl(request.scheme() + "//" + request.host() + "/api/auth/report/images/upload/" + dbImage.getUuid());
			response.status(200);
			response.body(AbstractRequestHandler.dataToJson(dbImage));
		}			
		
		return response.body();
	}

}
