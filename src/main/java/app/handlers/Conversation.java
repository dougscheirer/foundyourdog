package app.handlers;

import lombok.Data;

import java.util.List;

import app.model.Notification;

@Data
public class Conversation {
	List<Notification> messages;
	String partner_handle;
	String partner_id;
	
	Conversation(List<Notification> messages, DetailUser detailUser) {
		this.messages = messages;
		this.partner_handle = detailUser.getHandle();
		this.partner_id = detailUser.getUuid();
	}
}
