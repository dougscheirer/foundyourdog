package com.foundyourdog.app.db;

import java.net.URI;
import java.net.URISyntaxException;

public class DBConnection {

	public static String getUser() throws URISyntaxException {
		String envUrl = System.getenv("DATABASE_URL");
		URI dbUri = new URI(envUrl);
		return dbUri.getUserInfo().split(":")[0];
	}

	public static String getPassword() throws URISyntaxException {
		String envUrl = System.getenv("DATABASE_URL");
		URI dbUri = new URI(envUrl);
		return dbUri.getUserInfo().split(":")[1];
	}

	public static String getUrl() throws URISyntaxException {
		String envUrl = System.getenv("DATABASE_URL");
		URI dbUri = new URI(envUrl);

		return "jdbc:postgresql://" + dbUri.getHost() + ':' + dbUri.getPort() + dbUri.getPath();
	}
}
