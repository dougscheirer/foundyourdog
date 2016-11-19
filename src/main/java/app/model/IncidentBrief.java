package app.model;


import org.joda.time.DateTime;

import app.Validatable;
import lombok.Data;

@Data
public class IncidentBrief implements Validatable {

	private String uuid;
	private float map_latitude;
	private float map_longitude;
	private DateTime incident_date;
	private String state;
	private String resolution_id;
	private String reporter_id;

	// these come from the dog query
	private String dog_id;
	private String dog_name;
	private String dog_primary_type;
	private String dog_secondary_type;
	private String dog_primary_color;
	private String dog_secondary_color;
	private String dog_coat_type;
	private String dog_gender;

	@Override
	public boolean isValid() {
		// TODO Auto-generated method stub
		return false;
	}

}
