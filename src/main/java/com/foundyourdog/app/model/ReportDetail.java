package com.foundyourdog.app.model;

import com.foundyourdog.app.Validatable;
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
