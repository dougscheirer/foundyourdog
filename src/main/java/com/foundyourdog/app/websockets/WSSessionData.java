package com.foundyourdog.app.websockets;

import lombok.Data;

@Data
public class WSSessionData {
	public String sessionID;
	public String userID;
	
	public WSSessionData(String sessionID) {
		this.sessionID = sessionID;
	}
}
