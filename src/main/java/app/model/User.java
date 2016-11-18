package app.model;

import java.sql.Timestamp;

import app.Validatable;
import lombok.Data;

@Data
public class User implements Validatable {
	private String uuid;
	private String email;
	private String handle;
	private String password_hash;
	private String confirmation_token;
	private Boolean confirmed;
	private Timestamp signup_date;
	private Timestamp confirm_date;
	private Timestamp deactivate_date;
	private String phone1;
	private String phone2;
	private Boolean inapp_notifications;
	private Boolean admin;
	
	@Override
	public boolean isValid() {
		return true;
	}
}
