package com.foundyourdog.app;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import lombok.Getter;

@Getter
public class CloudinaryOpts {

	private String apiSecret;
	private String apiKey;
	private String cloudName;
	private String uploadUrl;

	final static Logger logger = LoggerFactory.getLogger(CloudinaryOpts.class);

	private boolean isMissing(String s) {
		return s == null || s.isEmpty();
	}
	
	public CloudinaryOpts() {
		this.apiSecret = ConfigConsts.getCloudinaryApiSecret();
		this.cloudName = ConfigConsts.getCloudinaryName();
		this.apiKey = ConfigConsts.getCloudinaryApiKey();
		
		this.uploadUrl = "https://api.cloudinary.com/v1_1/" + cloudName + "/upload";
		
		// if any of these are missing, things will fail
		if (isMissing(apiSecret) || isMissing(cloudName) || isMissing(apiKey)) {
			logger.info("Cloudinary is disabled, missing configuration options");
			this.apiSecret = this.cloudName = this.apiKey = this.uploadUrl = "";
		}
	}
}
