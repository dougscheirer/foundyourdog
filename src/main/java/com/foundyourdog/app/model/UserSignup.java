package com.foundyourdog.app.model;

import com.foundyourdog.app.Validatable;
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
