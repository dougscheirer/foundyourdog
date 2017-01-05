package com.foundyourdog.app.handlers.users.model;

import lombok.Data;
import org.joda.time.DateTime;

@Data
public class DetailUser {
	private String uuid;
	private String email;
	private String handle;
	private boolean confirmed;
	private DateTime signup_date;
	private DateTime confirm_date;
	private DateTime deactivate_date;
	private String phone1;
	private String phone2;
	private boolean inapp_notifications;
	private boolean admin;
}
