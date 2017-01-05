package com.foundyourdog.app.handlers.users.model;

import com.foundyourdog.app.handlers.Validatable;

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
