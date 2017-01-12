package com.foundyourdog.app.handlers.images;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import com.cloudinary.Cloudinary;
import com.foundyourdog.app.CloudinaryOpts;
import com.foundyourdog.app.Main;
import com.foundyourdog.app.ConfigConsts;
import com.foundyourdog.app.handlers.AbstractRequestHandler;
import com.foundyourdog.app.handlers.Answer;
import com.foundyourdog.app.handlers.EmptyPayload;
import com.foundyourdog.app.handlers.images.model.ImageDetailResponse;
import com.foundyourdog.app.model.Image;
import com.foundyourdog.app.model.Model;
import spark.Request;

public class ImageUploadHandler extends AbstractRequestHandler<EmptyPayload> {
	private CloudinaryOpts cloudinaryOpts;

	public ImageUploadHandler(Model model, CloudinaryOpts opts) {
		super(EmptyPayload.class, model);
		this.cloudinaryOpts = opts;
	}

	private boolean usingCloudinary() {
		return this.cloudinaryOpts != null && this.cloudinaryOpts.getApiKey() != null && this.cloudinaryOpts.getApiKey().isEmpty();
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
			ArrayList<String> tags = new ArrayList();
			tags.add("imageID:" + uuid);
			tags.add("userID:" + newImage.getUser_id());
			map.put("tags", tags);
			// sign them
			String signature = cloudinary.apiSignRequest(map, this.cloudinaryOpts.getApiSecret());
			// return the data for the browser to do the work
			retVal.setUploadSignature(signature);
			retVal.setUploadUrl(this.cloudinaryOpts.getUploadUrl());
			retVal.setApiKey(this.cloudinaryOpts.getApiKey());
			retVal.setCloudTags(tags);
			retVal.setUseCredentials(false);
		} else {
			// this is development, so...who cares
			retVal.setUploadSignature(dbImage.getUuid());
			retVal.setUploadUrl(request.scheme() + "://" + ConfigConsts.getHost() + "/api/auth/report/images/upload/" + dbImage.getUuid());
			retVal.setUseCredentials(true);
		}

		return new Answer(200, AbstractRequestHandler.dataToJson(retVal));
	}
}
