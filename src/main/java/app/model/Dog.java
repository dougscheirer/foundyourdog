package app.model;

import java.sql.Date;
import lombok.Data;

@Data
public class Dog {
	private int id;
	private String basic_type;
	private String gender;
	private Boolean intact;
	private int owner_id;
	private String tags;
	private String name;
	private Date added_date;
}
