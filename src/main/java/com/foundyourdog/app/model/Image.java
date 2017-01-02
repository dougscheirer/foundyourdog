package com.foundyourdog.app.model;

import java.sql.Timestamp;

import lombok.Data;
import com.foundyourdog.app.Validatable;

@Data
public class Image implements Validatable {
	private String uuid;
	private String user_id;
	private Timestamp upload_date;
	private String tags;
	private String dog_id;
	private String status;
	private String image_location; // either /:id or a cloudinary URL
	
	@Override
	public boolean isValid() {
		// TODO Auto-generated method stub
		return true;
	}
}
