package com.foundyourdog.app.handlers.users;

import com.foundyourdog.app.handlers.Validatable;

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
