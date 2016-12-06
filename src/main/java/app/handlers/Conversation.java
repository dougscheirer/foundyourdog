package app.handlers;

import lombok.Data;

import java.util.List;

import app.model.Notification;

@Data
public class Conversation {
	List<Notification> messages;
	String partner_handle;
	
	Conversation(List<Notification> messages, String partner_handle) {
		this.messages = messages;
		this.partner_handle = partner_handle;
	}
}
