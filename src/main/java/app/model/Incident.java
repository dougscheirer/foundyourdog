package app.model;

import java.sql.Date;

import app.Validatable;
import lombok.Data;

@Data
public class Incident implements Validatable {
	private String uuid;
	private float map_latitude;
	private float map_longitude;
	private String dog_id;
	private Date incident_date;
	private String state;
	private String resolution;
	private String reporter_id;
	
	@Override
	public boolean isValid() {
		// TODO Auto-generated method stub
		return true;
	}
}
