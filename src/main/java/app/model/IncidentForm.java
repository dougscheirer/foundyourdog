package app.model;

import java.sql.Date;

import app.Validatable;
import lombok.Data;

@Data
public class IncidentForm implements Validatable {
	private float map_latitude;
	private float map_longitude;
	private Date incident_date;
	private String reporter_id;
	private String dog_name;
	private String dog_basic_type;
	private String dog_color;
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
