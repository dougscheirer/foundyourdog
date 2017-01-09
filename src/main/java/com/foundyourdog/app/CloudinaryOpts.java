package com.foundyourdog.app;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import lombok.Getter;

@Getter
public class CloudinaryOpts {

	private String apiSecret;
	private String apiKey;
	private String cloudName;
	private String uploadUrl;
	private String apiUrl;
	
	final static Logger logger = LoggerFactory.getLogger(CloudinaryOpts.class);

	public CloudinaryOpts() {
		String baseUrl = ConfigConsts.getCloudinaryURL();
		if (baseUrl == null || baseUrl.isEmpty()) {
			logger.info("Cloudinary is disabled, missing configuration options");
			return;
		}
		
		// format is cloudinary://api_key:api_secret@name
		Pattern pat = Pattern.compile("cloudinary://([^:]+):([^@]+)@(.*)");
		Matcher match = pat.matcher(baseUrl);
		if (match.find()) {
			this.apiKey = match.group(1);
			this.apiSecret = match.group(2);
			this.cloudName = match.group(3);
		} else {
			logger.info("Malformed CLOUDINARY_URL, aborting.  Cloudinary is disabled");
		}

		logger.info("Using cloudinary '" + this.cloudName + "'");
		this.uploadUrl = "https://api.cloudinary.com/v1_1/" + cloudName + "/upload";
		this.apiUrl = "https://api.cloudinary.com/v1_1/" + cloudName + "/";
	}
}
