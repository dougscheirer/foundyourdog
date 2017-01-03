package com.foundyourdog.app.model;

import java.sql.Timestamp;

import com.foundyourdog.app.Validatable;

import lombok.Data;
import spark.Request;

@Data
public class ImageDetailResponse {
	// these overlap strongly with the DB record
	private String uuid;
	private String user_id;
	private Timestamp upload_date;
	private String tags;
	private String dog_id;
	private String status;
	// these are either transient or derived values
	private String uploadSignature; // (outbound)
	private String uploadUrl;		// (outbound)
	private String apiKey;			// (outbound)
	private String imageUrl;		// (outbound) this is generated by us or the cloud uploader
	private String upload_location_response;	// (inbound) this is the exact response from the uploader

	public ImageDetailResponse() {

	}

	public ImageDetailResponse(Image image) {
		// copy relevant bits
		this.uuid = image.getUuid();
		this.user_id = image.getUser_id();
		this.upload_date = image.getUpload_date();
		this.tags = image.getTags();
		this.dog_id = image.getDog_id();
		this.status = image.getStatus();
	}

	public void setImageUrl(Request request, String db_location) {
		if (db_location != null && db_location.startsWith("/") && request != null)
			this.imageUrl = request.scheme() + "://" + request.queryParams("host") + "/api/images/" + this.uuid;
		else
			this.imageUrl = db_location;	// assume this got validated elsewhere
	}
}