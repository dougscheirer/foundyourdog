package com.foundyourdog.app.db;

import java.net.URI;
import java.net.URISyntaxException;

import com.foundyourdog.app.ConfigConsts;

public class DBConnection {

	public static String getUser() throws URISyntaxException {
		String envUrl = ConfigConsts.getDatabaseUrl();
		URI dbUri = new URI(envUrl);
		return dbUri.getUserInfo().split(":")[0];
	}

	public static String getPassword() throws URISyntaxException {
		String envUrl = ConfigConsts.getDatabaseUrl();
		URI dbUri = new URI(envUrl);
		return dbUri.getUserInfo().split(":")[1];
	}

	public static String getUrl() throws URISyntaxException {
		String envUrl = ConfigConsts.getDatabaseUrl();
		URI dbUri = new URI(envUrl);

		return "jdbc:postgresql://" + dbUri.getHost() + ':' + dbUri.getPort() + dbUri.getPath();
	}
}
