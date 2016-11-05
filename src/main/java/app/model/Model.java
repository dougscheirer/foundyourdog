package app.model;

import java.util.List;
import java.util.Optional;

import app.handlers.PublicUser;
import app.handlers.DetailUser;

public interface Model {
	List<PublicUser> getAllPublicUsers();

	Optional<DetailUser> getDetailUser(int id);
	int signupUser(UserSignup value);
	Optional<DetailUser> authenticateUser(String user, String password);

	int createUser(User u);
	int updateUser(User u);
	int deleteUser(int id);
	
	List<Dog> getAllDogs();
	Optional<Dog> getDog(int id);
	int createDog(Dog d);
	int updateDog(Dog d);
	int deleteDog(int id);
	
	List<Incident> getAllIncidents();
	List<Incident> getAllIncidents(boolean lost);
	Optional<Incident> getIncident(int id);
	int createIncident(Incident i);
	int updateIncident(Incident i);
	int deleteIncident(int id);
	
	List<Image> getAllImages();
	Optional<Image> getImage(int id);
	int createImage(Image i);
	int updateImage(Image i);
	int deleteImage(int id);
}
