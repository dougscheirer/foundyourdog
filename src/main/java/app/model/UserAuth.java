package app.model;

import app.Validatable;
import lombok.Data;

@Data
public class UserAuth implements Validatable {
	private String user;
	private String password;
	
	@Override
	public boolean isValid() {
		return true;
	}
}
