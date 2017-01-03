package com.foundyourdog.app.model;

import java.sql.Timestamp;

import com.foundyourdog.app.handlers.Validatable;

import lombok.Data;

@Data
public class Dog implements Validatable {
	private String uuid;
	private String primary_type;
	private String secondary_type;
	private String primary_color;
	private String secondary_color;
	private String coat_type;
	private String gender;
	private Boolean intact;
	private String owner_id;
	private String tags;
	private String name;
	private Timestamp added_date;
	private String image_id;

	@Override
	public boolean isValid() {
		// TODO Auto-generated method stub
		return true;
	}
}
