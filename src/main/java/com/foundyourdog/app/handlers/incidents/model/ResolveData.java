package com.foundyourdog.app.handlers.incidents.model;

import com.foundyourdog.app.handlers.Validatable;

import lombok.Data;

@Data
public class ResolveData implements Validatable {
	String reason;
	String contact_user;
	String additional_info;
	
	@Override
	public boolean isValid() {
		// TODO Auto-generated method stub
		return true;
	}
}
