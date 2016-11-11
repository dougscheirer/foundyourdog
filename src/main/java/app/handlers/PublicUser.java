package app.handlers;

import java.sql.Timestamp;

import lombok.Data;

@Data
public class PublicUser {
	private int id;
	private String email;
	private String handle;
	private Boolean confirmed;
	private Timestamp signup_date;
	private Timestamp confirm_date;
	private Timestamp deactivate_date;
}
