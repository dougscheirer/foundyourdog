package app.model;

import java.sql.Date;
import lombok.Data;

@Data
public class Image {
	private int image_id;
	private int user_id;
	private String image_location;
	private Date upload_date;
	private String tags;
	private int dog_id;
}
