package com.foundyourdog.app.handlers.images;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.ProtocolException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.NoSuchFileException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.Map;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.foundyourdog.app.CloudinaryOpts;
import com.foundyourdog.app.Main;
import com.foundyourdog.app.handlers.AbstractRequestHandler;
import com.foundyourdog.app.handlers.Answer;
import com.foundyourdog.app.handlers.EmptyPayload;
import com.foundyourdog.app.handlers.users.model.DetailUser;
import com.foundyourdog.app.model.Image;
import com.foundyourdog.app.model.Model;
import spark.Request;

public class ImageDeleteHandler extends AbstractRequestHandler<EmptyPayload> {
	final static Logger logger = LoggerFactory.getLogger(Main.class);
	
	CloudinaryOpts opts;
	
	public ImageDeleteHandler(Model model, CloudinaryOpts opts) {
		super(EmptyPayload.class, model);
		this.opts = opts;
	}

	@Override
	protected Answer processImpl(EmptyPayload value, Map<String, String> urlParams, boolean shouldReturnHtml,
			Request request) {
		DetailUser u = Main.getCurrentUser(request);
		if (u == null) {
			return new Answer(401);
		}

		String imageID = request.params(":id");
		Optional<Image> image = model.getImage(imageID);
		// make sure they are authorized to delete it
		if (image.get() == null) {
			return new Answer(404);
		}
		if (!image.get().getUser_id().equals(u.getUuid()) && !u.isAdmin()) {
			return new Answer(403); // you are forbidden
		}

		// delete the image file
		String loc = image.get().getImage_location();
		if (loc.startsWith("/")) {
			Path path = Paths.get(loc + "/" + imageID);
			try {
				Files.delete(path);
			} catch (NoSuchFileException e) {
				logger.error(e.getMessage());
			} catch (IOException e) {
				logger.error(e.getMessage());
			}
		} else {
			// cloudinary, attempt the admin delete api
			String deleteUrl = this.opts.getApiUrl() + "resources/image/tags/imageID:" + imageID;
			try {
				URL url = new URL(deleteUrl);
				HttpURLConnection httpCon = (HttpURLConnection) url.openConnection();
				httpCon.setRequestMethod("DELETE");
				// basic auth encode the api key:api secret
				String preAuth = opts.getApiKey() + ":" + opts.getApiSecret();
				String auth = Base64.getEncoder().encodeToString(preAuth.getBytes()); 
				httpCon.setRequestProperty("Authorization", auth);
				httpCon.connect();
				if (httpCon.getResponseCode() != 200) {
					logger.error("Error deleting " + imageID + ": (" + httpCon.getResponseCode() + ") " + httpCon.getResponseMessage());
				} else {
					logger.debug("Deleted " + imageID + " OK: " + httpCon.getResponseMessage());
				}
			} catch (ProtocolException e) {
				logger.error(e.getMessage());
			} catch (IOException e) {
				logger.error(e.getMessage());
			}
		}

		// also clean up the DB
		model.deleteImage(imageID);
		return new Answer(200);
	}

}
