package app.model;

import java.sql.Date;
import java.util.UUID;

import lombok.Data;

@Data
public class User {
	public int id;
	public String email;
	public String handle;
	public String password_hash;
	public String confirmation_token;
	public Boolean confirmed;
	public Date signup_date;
	public Date confirm_date;
	public Date deactivate_date;
	public String phone1;
	public String phone2;
	public Boolean inapp_notifications;
}
