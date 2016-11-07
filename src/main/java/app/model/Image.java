package app.model;

import java.sql.Date;
import lombok.Data;
import app.Validatable;

@Data
public class Image implements Validatable {
	private String uuid;
	private String user_id;
	private String image_location;
	private Date upload_date;
	private String tags;
	private String dog_id;
	
	@Override
	public boolean isValid() {
		// TODO Auto-generated method stub
		return true;
	}
}
