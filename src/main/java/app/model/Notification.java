package app.model;

import java.sql.Timestamp;

import app.Validatable;
import lombok.Data;

@Data
public class Notification implements Validatable {
    private String uuid;
    private int ordinal;
    private String incident_id;
    private String receiver_id;
    private Timestamp sent_date;
    private String sender_id;
    private boolean sender_read;
    private boolean sender_delete;
    private String message;
    private String sender_flagged;
    private String responding_to;
	
	@Override
	public boolean isValid() {
		// TODO Auto-generated method stub
		return true;
	}
}
