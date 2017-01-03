package com.foundyourdog.app.handlers.messages.model;

import lombok.Data;

import java.util.List;

import com.foundyourdog.app.handlers.users.model.DetailUser;
import com.foundyourdog.app.model.Message;

@Data
public class Conversation {
	List<Message> messages;
	String partner_handle;
	String partner_id;
	
	public Conversation(List<Message> messages, DetailUser detailUser) {
		this.messages = messages;
		this.partner_handle = detailUser.getHandle();
		this.partner_id = detailUser.getUuid();
	}
}
