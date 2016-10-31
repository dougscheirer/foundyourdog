package app.model;

import java.sql.Date;

import app.Validatable;
import lombok.Data;

@Data
public class Incident implements Validatable {
	private int id;
	private float map_latitude;
	private float map_longitude;
	private int dog_id;
	private Date incident_date;
	private String state;
	private String resolution;
	private int reporter_id;
	
	@Override
	public boolean isValid() {
		// TODO Auto-generated method stub
		return true;
	}
}
