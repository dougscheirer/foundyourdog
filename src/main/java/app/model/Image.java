package app.model;

import org.joda.time.DateTime;

import lombok.Data;
import app.Validatable;

@Data
public class Image implements Validatable {
	private String uuid;
	private String user_id;
	private String image_location;
	private DateTime upload_date;
	private String tags;
	private String dog_id;
	private String status;
	
	@Override
	public boolean isValid() {
		// TODO Auto-generated method stub
		return true;
	}
}
