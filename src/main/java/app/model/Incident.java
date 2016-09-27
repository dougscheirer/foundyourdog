package app.model;

import java.sql.Date;

import lombok.Data;

@Data
public class Incident {
	private int id;
	private float map_latitude;
	private float map_longitude;
	private int dog_id;
	private Date incident_date;
	private String state;
	private String resolution;
}
