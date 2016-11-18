package app.model;

import java.util.List;
import java.util.Optional;

import app.handlers.PublicUser;
import app.handlers.DetailUser;

public interface Model {
	List<PublicUser> getAllPublicUsers();

	Optional<DetailUser> getDetailUser(String id);
	String signupUser(UserSignup value);
	Optional<DetailUser> authenticateUser(String user, String password);

	String createUser(User u);
	String updateUser(User u);
	String deleteUser(String id);
	
	List<Dog> getAllDogs();
	Optional<Dog> getDog(String id);
	String createDog(Dog d);
	String updateDog(Dog d);
	String deleteDog(int id);
	
	List<Incident> getAllIncidents();
	List<IncidentBrief> getAllIncidents(boolean lost);
	Optional<Incident> getIncident(String id);
	String createIncident(Incident i);
	String updateIncident(Incident i);
	String deleteIncident(String id);
	
	List<Image> getAllImages();
	Optional<Image> getImage(String id);
	String createImage(Image i);
	String updateImage(Image i);
	String updateImageStatus(String imageID, String dogId, String status);
	Optional<Image> getUnassignedImage(String userid);
	void deleteImage(String id);

	List<IncidentBrief> getUserIncidents(String userId, String type);
}
