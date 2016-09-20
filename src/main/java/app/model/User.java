package app.model;

import java.sql.Date;
import app.Validatable;
import lombok.Data;

@Data
public class User implements Validatable {
	private int id;
	private String email;
	private String handle;
	private String password_hash;
	private String confirmation_token;
	private Boolean confirmed;
	private Date signup_date;
	private Date confirm_date;
	private Date deactivate_date;
	private String phone1;
	private String phone2;
	private Boolean inapp_notifications;
	
	@Override
	public boolean isValid() {
		return true;
	}
}
