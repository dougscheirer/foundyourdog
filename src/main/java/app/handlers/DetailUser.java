package app.handlers;

import java.sql.Timestamp;

import lombok.Data;

@Data
public class DetailUser {
	private String uuid;
	private String email;
	private String handle;
	private Boolean confirmed;
	private Timestamp signup_date;
	private Timestamp confirm_date;
	private Timestamp deactivate_date;
	private String phone1;
	private String phone2;
	private Boolean inapp_notifications;
}
