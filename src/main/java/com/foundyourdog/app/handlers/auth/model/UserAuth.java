package com.foundyourdog.app.handlers.auth.model;

import com.foundyourdog.app.handlers.Validatable;

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
