package com.foundyourdog.app.handlers.incidents.model;

import com.foundyourdog.app.handlers.Validatable;
import com.foundyourdog.app.handlers.images.model.ImageDetailResponse;
import com.foundyourdog.app.model.Dog;
import com.foundyourdog.app.model.Incident;

import lombok.Data;

@Data
public class ReportDetail implements Validatable {
	private Incident incident;
	private Dog dog;
	private ImageDetailResponse image;
	
	@Override
	public boolean isValid() {
		// TODO Auto-generated method stub
		return true;
	}
}
