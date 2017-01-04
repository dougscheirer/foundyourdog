package com.foundyourdog.app;

public class ConfigConsts {
	// 'postgres://postgres:pa55word@localhost:5432/foundyourdog_dev'
	//	URL for postgres
	private static String DATABASE_URL = "DATABASE_URL";

	// port to run the java backend on
	private static String PORT = "PORT";						
	
	// require basic auth on loading /index.html with this user/password combo (e.g. admin:pizza)
	private static String BASIC_AUTH = "BASIC_AUTH";
	
	// provide the actual port that the java app is running on for web socket connections
	// in production environments or heroku, this may not be the publicly exposed port if proxying is used
	private static String WS_DEV_MODE="WS_DEV_MODE";
	
	// API key for emailing through sendgrid (default is to use SMTP to localhost:1025, i.e. mailcatcher)
	private static String SENDGRID_API_KEY = "SENDGRID_API_KEY";
	
	// For production or heroku, the Cloudinary info for image management.  Default is local storage in uploads/images
	private static String CLOUDINARY_API_SECRET = "CLOUDINARY_API_SECRET";
	private static String CLOUDINARY_NAME = "CLOUDINARY_NAME";
	private static String CLOUDINARY_API_KEY = "CLOUDINARY_API_KEY";
	
	// For link generation, ignore the actual scheme used and assume it should be HTTPS (e.g. proxying on heroku)
	private static String ASSUME_HTTPS = "ASSUME_HTTPS";
	
	// For email from addressing, the system email (default is fydo-admin@foundyourdog.com)
	private static String ADMIN_EMAIL = "ADMIN_EMAIL";

	// helpers
	private static String getEnv(String key) {
		return getEnv(key, "");
	}
	
	private static String getEnv(String key, String def) {
		String ret = System.getenv(key);
		return (ret == null || ret.isEmpty()) ? def : ret;
	}
	
	public static String getDatabaseUrl() 	{ return getEnv(DATABASE_URL); 	}
	public static String getPort() 			{ return getEnv(PORT); 			}					
	public static String getBasicAuth() 	{ return getEnv(BASIC_AUTH); 	}					
	public static boolean getWSDevMode() 	{ return Boolean.valueOf(getEnv(WS_DEV_MODE, "false")); 	}					
	public static String getSendgridAPIKey() 
											{ return getEnv(SENDGRID_API_KEY); }					
	public static String getCloudinaryApiSecret() 
											{ return getEnv(CLOUDINARY_API_SECRET); }					
	public static String getCloudinaryApiKey() 
											{ return getEnv(CLOUDINARY_API_KEY); }					
	public static String getCloudinaryName() 
											{ return getEnv(CLOUDINARY_NAME); }					
	public static boolean getAssumeHTTPS() 	{ return Boolean.valueOf(getEnv(ASSUME_HTTPS, "true")); }					
	public static String getAdminEmail() 	{ return getEnv(ADMIN_EMAIL, "fydo-admin@foundyourdog.com"); }					
}
