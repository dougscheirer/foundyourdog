package com.foundyourdog.app.model;

import java.sql.Timestamp;

import com.foundyourdog.app.Validatable;
import lombok.Data;

@Data
public class Message implements Validatable {
    private String uuid;
    private int ordinal;
    private String incident_id;
    private String receiver_id;
    private Timestamp sent_date;
    private String sender_id;
    private boolean receiver_read;
    private boolean receiver_delete;
    private String message;
    private String receiver_flagged;
    private String responding_to;
	
	@Override
	public boolean isValid() {
		// TODO Auto-generated method stub
		return true;
	}
}
