package com.foundyourdog.app.model;

import java.sql.Timestamp;

import com.foundyourdog.app.Validatable;

import lombok.Data;
import spark.Request;

@Data
public class ImageDetail extends ImageDetailResponse implements Validatable {
	public ImageDetail() {
	}
	
	@Override
	public boolean isValid() {
		// TODO Auto-generated method stub
		return true;
	}
}
