package com.foundyourdog.app.model;

import com.foundyourdog.app.Validatable;
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
