package app.handlers;

import java.sql.Date;

import lombok.Data;

@Data
public class PublicUser {
	private int id;
	private String email;
	private String handle;
	private Boolean confirmed;
	private Date signup_date;
	private Date confirm_date;
	private Date deactivate_date;
}
