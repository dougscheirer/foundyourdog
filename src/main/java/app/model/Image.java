package app.model;

import java.sql.Timestamp;

import lombok.Data;
import app.Validatable;

@Data
public class Image implements Validatable {
	private String uuid;
	private String user_id;
	private String image_location;
	private Timestamp upload_date;
	private String tags;
	private String dog_id;
	private String status;
	
	@Override
	public boolean isValid() {
		// TODO Auto-generated method stub
		return true;
	}
}
