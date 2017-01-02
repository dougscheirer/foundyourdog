package com.foundyourdog.app.handlers;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.sql.Timestamp;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import javax.servlet.MultipartConfigElement;
import javax.servlet.http.Part;

import com.foundyourdog.app.Main;
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
		if (Main.getCurrentUser(request).getUuid() != dbImage.get().getUser_id()) {
			response.status(401);
			response.body("Forbidden");
			return response.body();
		}
		
		dbImage.get().setImage_location(this.imageLocation);
		// direct file upload to the app server (dev mode)
	    MultipartConfigElement multipartConfigElement = new MultipartConfigElement("/tmp");
	    request.raw().setAttribute("org.eclipse.jetty.multipartConfig", multipartConfigElement);
	    Part file = request.raw().getPart("file"); //file is name of the upload form
	    InputStream is = (InputStream) file.getInputStream();
	    FileOutputStream os = new FileOutputStream(new File(this.imageLocation, dbImage.get().getUuid()));
	    
	    int read = 0;
		byte[] bytes = new byte[1024];

		while ((read = is.read(bytes)) != -1) {
			os.write(bytes, 0, read);
		}
		os.close();
		is.close();
	
		// update the DB record
		model.updateImage(dbImage.get());
		
		response.status(200);
		response.body(AbstractRequestHandler.dataToJson(dbImage));

		return response.body(); 
	}
}
