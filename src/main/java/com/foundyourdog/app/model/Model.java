package com.foundyourdog.app.model;

import java.util.List;
import java.util.Optional;

import com.foundyourdog.app.handlers.incidents.model.IncidentBrief;
import com.foundyourdog.app.handlers.messages.model.DetailMessage;
import com.foundyourdog.app.handlers.users.ResetPassword;
import com.foundyourdog.app.handlers.users.model.DetailUser;
import com.foundyourdog.app.handlers.users.model.PublicUser;
import com.foundyourdog.app.handlers.users.model.UserSignup;

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
	boolean updateImage(Image i);
	String updateImageStatus(String imageID, String dogId, String status);
	Optional<Image> getUnassignedImage(String userid);
	boolean deleteImage(String id);

	List<IncidentBrief> getUserIncidents(String userId, String type);

	List<DetailMessage> getUserMessages(String userId, String type);
	String createMessage(Message value);

	Optional<Message> getMessage(String incident_id);
	List<Message> getConversation(String incident_id, String receiver_id, String sender_id, int ordinal_start);
	Optional<DetailUser> getDetailUserFromEmail(String email);
	String updatePasswordResetToken(String email);

	boolean resetPassword(ResetPassword reset);

	int getUnreadMessages(String receiver_id);

	boolean markConversation(String incident_id, String id1, String id2, String curUserId, int ordinal_start, boolean read);
}
