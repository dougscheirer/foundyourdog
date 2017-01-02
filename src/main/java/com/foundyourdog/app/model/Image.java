package com.foundyourdog.app.model;

import java.sql.Timestamp;

import lombok.Data;
import com.foundyourdog.app.Validatable;

@Data
public class Image implements Validatable {
	private String uuid;
	private String user_id;
	private String image_location;
	private Timestamp upload_date;
	private String tags;
	private String dog_id;
	private String status;
	// TODO: refactor this, the Image in the DB vs the Image client/server data
	private String uploadSignature;
	private String uploadUrl;
	private String apiKey;
	
	@Override
	public boolean isValid() {
		// TODO Auto-generated method stub
		return true;
	}
}
