package com.foundyourdog.app.model;

import com.foundyourdog.app.Validatable;
import lombok.Data;

@Data
public class ResetPassword implements Validatable {
	private String email;
	private String password;
	private String reset_token;
	
	@Override
	public boolean isValid() {
		return true;
	}
}
