package com.foundyourdog.app.handlers.incidents.model;

import java.sql.Timestamp;

import com.foundyourdog.app.handlers.Validatable;

import lombok.Data;

@Data
public class IncidentForm implements Validatable {
	private float map_latitude;
	private float map_longitude;
	private Timestamp incident_date;
	private String reporter_id;
	private String dog_name;
	private String dog_secondary_type;
	private String dog_primary_type;
	private String dog_secondary_color;
	private String dog_primary_color;
	private String dog_coat_type;
	private String dog_breeding_status;
	private String dog_gender;
	private String photo_id;
	private String other_info;
	
	@Override
	public boolean isValid() {
		// TODO Auto-generated method stub
		return true;
	}
}
