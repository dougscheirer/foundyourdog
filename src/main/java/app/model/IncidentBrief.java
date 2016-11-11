package app.model;

import java.sql.Date;
import java.sql.Timestamp;

import app.Validatable;
import lombok.Data;

@Data
public class IncidentBrief implements Validatable {

	private String uuid;
	private float map_latitude;
	private float map_longitude;
	private Timestamp incident_date;
	private String state;
	private String resolution;
	private String reporter_id;

	// these come from the dog query
	private String dog_id;
	private String dog_name;
	private String dog_basic_type;
	private String dog_color;
	private String dog_gender;

	@Override
	public boolean isValid() {
		// TODO Auto-generated method stub
		return false;
	}

}
