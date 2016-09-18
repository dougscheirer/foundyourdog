package app.model;

import java.util.List;
import java.util.Optional;

public interface Model {
	List<User> getAllUsers();
	Optional<User> getUser(int id);
	int createUser(User u);
	int updateUser(User u);
	int deleteUser(int id);
	
	List<Dog> getAllDogs();
	Optional<Dog> getDog(int id);
	int createDog(Dog d);
	int updateDog(Dog d);
	int deleteDog(int id);
	
	List<Incident> getAllIncidents();
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
