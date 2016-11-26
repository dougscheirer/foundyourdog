package app.handlers;

import java.sql.Timestamp;

import lombok.Data;

@Data
public class DetailNotification {
    private String uuid;
    private String incident_id;
    private String receiver_id;
    private String receiver_handle;
    private Timestamp sent_date;
    private String sender_id;
    private String sender_handle;
    private boolean sender_read;
    private boolean sender_delete;
    private String message;
    private String sender_flagged;
    private String responding_to;
}
