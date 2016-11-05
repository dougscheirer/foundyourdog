package app.model;

import java.sql.Date;
import java.util.UUID;

import app.Validatable;
import lombok.Data;

@Data
public class UserSignup implements Validatable {
	private String email;
	private String userid;
	private String password;
	@Override
	public boolean isValid() {
		return true;
	}
}
