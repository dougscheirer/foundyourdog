package com.foundyourdog.app.handlers;

import org.joda.time.DateTime;

import lombok.Data;

@Data
public class PublicUser {
	private int id;
	private String email;
	private String handle;
	private boolean confirmed;
	private DateTime signup_date;
	private DateTime confirm_date;
	private DateTime deactivate_date;
}
