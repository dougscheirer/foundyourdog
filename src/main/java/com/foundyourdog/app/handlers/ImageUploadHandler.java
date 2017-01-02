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
import com.foundyourdog.app.Answer;
import com.foundyourdog.app.Main;
import com.foundyourdog.app.model.Image;
import com.foundyourdog.app.model.ImageDetail;
import com.foundyourdog.app.model.ImageDetailResponse;
import com.foundyourdog.app.model.Model;
import spark.Request;
import spark.Response;
import spark.Route;

public class ImageUploadHandler extends AbstractRequestHandler<EmptyPayload> {
	
	private Model model;
	private String cloudinarySecret;
	private String cloudinaryUrl;
	private String cloudinaryApiKey;
	
	public ImageUploadHandler(Model model, String imageLocation, String cloudinarySecret, String cloudinaryUrl, String cloudinaryApiKey) {
		super(EmptyPayload.class, model);
		this.model = model;
		this.cloudinarySecret = cloudinarySecret;
		this.cloudinaryUrl = cloudinaryUrl;
		this.cloudinaryApiKey = cloudinaryApiKey;
	}
	
	private boolean usingCloudinary() {
		return !this.cloudinarySecret.isEmpty();
	}
	
	protected Answer processImpl(EmptyPayload value, Map<String, String> urlParams, boolean shouldReturnHtml,
			Request request) {
		// first create the DB entry, then save the file
		Image newImage = new Image();
		newImage.setUser_id(Main.getCurrentUser(request).getUuid());
		newImage.setUpload_date(new Timestamp(System.currentTimeMillis()));
		newImage.setStatus("unassigned");

		// TODO: if it's not part of a report, it will have a dog id (probably)
		String uuid = model.createImage(newImage);
		if (uuid == null) {
			return new Answer(500);
		}
		
		Image dbImage = model.getImage(uuid).get();
		// we return a hybrid of generated and DB data
		ImageDetailResponse retVal = new ImageDetailResponse(dbImage);
		
		if (usingCloudinary()) {
			Cloudinary cloudinary = new Cloudinary();
			// create a list of options for the upload
			Map<String, Object> map = new HashMap<String, Object>();
			map.put("timestamp", newImage.getUpload_date().getTime());
			map.put("public_id", newImage.getUuid());
			// sign them
			String signature = cloudinary.apiSignRequest(map, this.cloudinarySecret);
			// return the data for the browser to do the work
			retVal.setUploadSignature(signature);
			retVal.setUploadUrl(this.cloudinaryUrl);
			retVal.setApiKey(this.cloudinaryApiKey);
		} else {
			retVal.setUploadSignature(dbImage.getUuid());
			// TODO: make this a little less static definition
			retVal.setUploadUrl(request.scheme() + "//" + request.host() + "/api/auth/report/images/upload/" + dbImage.getUuid());
		}			
		
		return new Answer(200, AbstractRequestHandler.dataToJson(retVal));
	}
}
