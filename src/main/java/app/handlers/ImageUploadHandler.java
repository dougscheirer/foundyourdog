package app.handlers;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;

import javax.servlet.MultipartConfigElement;
import javax.servlet.http.Part;

import app.Main;
import app.model.Image;
import app.model.Model;
import spark.Request;
import spark.Response;
import spark.Route;

public class ImageUploadHandler implements Route {
	
	private Model model;
	private String imageLocation;
	
	public ImageUploadHandler(Model model, String imageLocation) {
		this.model = model;
		this.imageLocation = imageLocation;
	}
	
	@Override
	public Object handle(Request request, Response response) throws Exception {
		// first create the DB entry, then save the file
		Image newImage = new Image();
		java.util.Date utilDate = new java.util.Date();
		newImage.setUser_id(Main.getCurrentUser(request).getUuid());
		newImage.setImage_location(this.imageLocation);
		newImage.setUpload_date(new java.sql.Timestamp(utilDate.getTime()));
		newImage.setStatus("unassigned");
		// TODO: if it's not part of a report, it will have a dog id
		String uuid = model.createImage(newImage);
		if (uuid == null) {
			response.status(500);
			response.body("Error trying to create upload entry");
			return response.body();
		}
		
	    MultipartConfigElement multipartConfigElement = new MultipartConfigElement("/tmp");
	    request.raw().setAttribute("org.eclipse.jetty.multipartConfig", multipartConfigElement);
	    Part file = request.raw().getPart("file"); //file is name of the upload form
	    InputStream is = (InputStream) file.getInputStream();
	    FileOutputStream os = new FileOutputStream(new File(this.imageLocation, uuid));
	    
	    int read = 0;
		byte[] bytes = new byte[1024];

		while ((read = is.read(bytes)) != -1) {
			os.write(bytes, 0, read);
		}
		os.close();
		is.close();
		
		response.status(200);
		response.body(AbstractRequestHandler.dataToJson(model.getImage(uuid).get()));
		
		return response.body();
	}

}
