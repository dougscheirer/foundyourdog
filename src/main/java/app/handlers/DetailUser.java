package app.handlers;

import java.sql.Date;

import lombok.Data;

@Data
public class DetailUser {
	private String uuid;
	private String email;
	private String handle;
	private Boolean confirmed;
	private Date signup_date;
	private Date confirm_date;
	private Date deactivate_date;
	private String phone1;
	private String phone2;
	private Boolean inapp_notifications;
}
