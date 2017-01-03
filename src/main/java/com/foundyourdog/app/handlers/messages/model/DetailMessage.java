package com.foundyourdog.app.handlers.messages.model;

import java.sql.Timestamp;

import lombok.Data;

@Data
public class DetailMessage {
    private String uuid;
    private String incident_id;
    private String receiver_id;
    private String receiver_handle;
    private Timestamp sent_date;
    private String sender_id;
    private String sender_handle;
    private boolean receiver_read;
    private boolean receiver_delete;
    private String message;
    private String receiver_flagged;
    private String responding_to;
}
