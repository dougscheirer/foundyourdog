package app.model;

import java.sql.Date;

import app.Validatable;
import lombok.Data;

@Data
public class Dog implements Validatable {
	private String uuid;
	private String basic_type;
	private String color;
	private String gender;
	private Boolean intact;
	private String owner_id;
	private String tags;
	private String name;
	private Date added_date;

	@Override
	public boolean isValid() {
		// TODO Auto-generated method stub
		return true;
	}
}
