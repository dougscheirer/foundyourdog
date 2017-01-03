package com.foundyourdog.app.handlers.images;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.util.Optional;

import javax.servlet.MultipartConfigElement;
import javax.servlet.http.Part;

import com.foundyourdog.app.Main;
import com.foundyourdog.app.handlers.AbstractRequestHandler;
import com.foundyourdog.app.handlers.images.model.UploadResponse;
import com.foundyourdog.app.model.Image;
import com.foundyourdog.app.model.Model;

import spark.Request;
import spark.Response;
import spark.Route;

public class ImageUploadFileHandler implements Route {
	
	private Model model;
	private String imageLocation;
	
	public ImageUploadFileHandler(Model model, String imageLocation) {
		this.model = model;
		this.imageLocation = imageLocation;
	}
	
	@Override
	public Object handle(Request request, Response response) throws Exception {
		// the ID is in the request
		String id = request.params("id");
		Optional<Image> dbImage = model.getImage(id);
		if (dbImage.get() == null) {
			response.status(500);
			response.body("Server error");
			return response.body();
		}
		
		// validate that the current user is the owner of the db object
		if (!Main.getCurrentUser(request).getUuid().equals(dbImage.get().getUser_id())) {
			response.status(401);
			response.body("Forbidden");
			return response.body();
		}
		
		// direct file upload to the app server (dev mode)
	    MultipartConfigElement multipartConfigElement = new MultipartConfigElement("/tmp");
	    request.raw().setAttribute("org.eclipse.jetty.multipartConfig", multipartConfigElement);
	    Part mimefile = request.raw().getPart("file"); // file is name of the upload form
	    InputStream is = (InputStream) mimefile.getInputStream();
	    File file = new File(this.imageLocation, dbImage.get().getUuid());
	    FileOutputStream os = new FileOutputStream(file);
	    
	    int read = 0;
		byte[] bytes = new byte[1024];

		while ((read = is.read(bytes)) != -1) {
			os.write(bytes, 0, read);
		}
		os.close();
		is.close();
	
		// update the DB record (the '/' is helpful for telling local from remote paths)
		dbImage.get().setImage_location("/" + this.imageLocation);
		model.updateImage(dbImage.get());
		
		// prepare the response
		UploadResponse ur = new UploadResponse();
		ur.setSecure_url("/" + dbImage.get().getUuid()); // we just need something that starts with a '/' here
		
		response.status(200);
		response.body(AbstractRequestHandler.dataToJson(ur));

		return response.body(); 
	}
}
