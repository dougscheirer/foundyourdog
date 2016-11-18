package app.sql2o;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.sql2o.Connection;
import org.sql2o.Sql2o;

import app.model.Dog;
import app.model.Image;
import app.model.Incident;
import app.model.IncidentBrief;
import app.model.Model;
import app.model.User;
import app.model.UserSignup;
import app.handlers.PublicUser;
import app.handlers.DetailUser;

public class Sql2oModel implements Model {
	private Sql2o sql2o;

	public Sql2oModel(Sql2o sql2o) {
		this.sql2o = sql2o;
	}

	@Override
	public List<PublicUser> getAllPublicUsers() {
		try (Connection conn = sql2o.open()) {
			List<PublicUser> users = conn
					.createQuery(
							"select id, email, handle, confirmed, signup_date, confirm_date, deactivate_date from users order by id")
					.executeAndFetch(PublicUser.class);
			return users;
		}
	}

	@Override
	public Optional<DetailUser> getDetailUser(String id) {
		try (Connection conn = sql2o.open()) {
			List<DetailUser> users = conn
					.createQuery(
							"select uuid, email, handle, confirmed, signup_date, confirm_date, deactivate_date, phone1, phone2, inapp_notifications, admin from users where uuid=:id")
					.addParameter("id", id).executeAndFetch(DetailUser.class);
			if (users.size() > 0) {
				return Optional.empty();
			} else if (users.size() == 1) {
				return Optional.of(users.get(0));
			} else {
				throw new RuntimeException();
			}
		}
	}

	@Override
	public String createUser(User u) {
		try (Connection conn = sql2o.open()) {
			String uuid = UUID.randomUUID().toString();
			conn.createQuery(
					"insert into users(uuid, email, handle, password_hash, confirmation_token, phone1, phone2, inapp_notifications, admin)"
							+ "   VALUES (:uuid, :email, :handle, :password_hash, :confirmation_token, :phone1, :phone2, :inapp_notifications)")
					.addParameter("uuid", uuid)
					.addParameter("email", u.getEmail())
					.addParameter("handle", u.getHandle())
					.addParameter("password_hash", u.getPassword_hash())
					.addParameter("confirmation_token", u.getConfirmation_token())
					.addParameter("phone1", u.getPhone1())
					.addParameter("phone2", u.getPhone2())
					.addParameter("inapp_notifications", u.getInapp_notifications())
					.addParameter("admin", false)
					.executeUpdate();
			return uuid;
		}
	}

	@Override
	public String updateUser(User u) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String deleteUser(String id) {
		// TODO Auto-generated method stub
		return new String();
	}

	@Override
	public List<Dog> getAllDogs() {
		return null;
	}

	@Override
	public List<IncidentBrief> getAllIncidents(boolean lost) {
		try (Connection conn = sql2o.open()) {
			List<IncidentBrief> incidents = 
					conn.createQuery("select I.uuid as uuid, map_latitude, map_longitude, incident_date, state, resolution_id, reporter_id, D.uuid as dog_id, D.name as dog_name, D.color as dog_color, D.gender as dog_gender, D.basic_type as dog_basic_type from incidents I inner join dogs D on D.uuid=I.dog_id where I.state=:state")
					.addParameter("state", (lost) ? "lost" : "found").executeAndFetch(IncidentBrief.class);
			return incidents;
		}
	}

	@Override
	public Optional<Dog> getDog(String id) {
		try (Connection conn = sql2o.open()) {
			List<Dog> dogs = conn.createQuery("select * from dogs where uuid=:id")
					.addParameter("id", id).executeAndFetch(Dog.class);
			if (dogs.size() != 1) {
				return Optional.empty();
			}
			return Optional.of(dogs.get(0));
		}
	}

	@Override
	public String createDog(Dog d) {
		try (Connection conn = sql2o.open()) {
			String uuid = UUID.randomUUID().toString();
			conn.createQuery(
					"insert into dogs (uuid, basic_type, color, gender, intact, owner_id, name, added_date, image_id)" +
					"values(:uuid, :basic_type, :color, :gender, :intact, :owner_id, :name, :added_date, :image_id)")
					.addParameter("uuid", uuid)
					.addParameter("basic_type", d.getBasic_type())
					.addParameter("color", d.getColor())
					.addParameter("gender", d.getGender())
					.addParameter("intact", d.getIntact())
					.addParameter("owner_id", d.getOwner_id())
					.addParameter("name", d.getName())
					.addParameter("added_date", d.getAdded_date())
					.addParameter("image_id", d.getImage_id())
					.executeUpdate();
			
			return uuid;
		}
	}

	@Override
	public String updateDog(Dog d) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String deleteDog(int id) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<Incident> getAllIncidents() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Optional<Incident> getIncident(String id) {
		try (Connection conn = sql2o.open()) {
			List<Incident> incidents = conn.createQuery("select * from incidents where uuid=:id")
					.addParameter("id", id).executeAndFetch(Incident.class);
			if (incidents.size() != 1) {
				return Optional.empty();
			}
			return Optional.of(incidents.get(0));
		}
	}

	@Override
	public String createIncident(Incident i) {
		try (Connection conn = sql2o.open()) {
			String uuid = UUID.randomUUID().toString();
			conn.createQuery(
					"insert into incidents (uuid, map_latitude, map_longitude, reporter_id, dog_id, incident_date, state)" +
					"values(:uuid, :map_latitude, :map_longitude, :reporter_id, :dog_id, :incident_date, :state)")
		    	.addParameter("uuid", uuid)
		    	.addParameter("map_latitude", i.getMap_latitude())
		    	.addParameter("map_longitude", i.getMap_longitude())
		    	.addParameter("reporter_id", i.getReporter_id())
		    	.addParameter("dog_id", i.getDog_id())
		    	.addParameter("incident_date", i.getIncident_date())
		    	.addParameter("state", i.getState())
		    	.executeUpdate();
			
			return uuid;
		}
	}

	@Override
	public String updateIncident(Incident i) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String deleteIncident(String id) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<Image> getAllImages() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Optional<Image> getImage(String id) {
		try (Connection conn = sql2o.open()) {
			List<Image> images = conn.createQuery("select * from images where uuid=:id")
					.addParameter("id", id).executeAndFetch(Image.class);
			if (images.size() != 1) {
				return Optional.empty();
			}
			return Optional.of(images.get(0));
		}
	}
	@Override
	public String createImage(Image i) {
		try (Connection conn = sql2o.open()) {
			String uuid = UUID.randomUUID().toString();
			conn.createQuery(
					"insert into images(uuid, user_id, image_location, upload_date, tags, dog_id, status)"
							+ "   VALUES (:uuid, :user_id, :image_location, :upload_date, :tags, :dog_id, :status)")
					.addParameter("uuid", uuid)
					.addParameter("user_id", i.getUser_id())
					.addParameter("image_location", i.getImage_location())
					.addParameter("upload_date", i.getUpload_date())
					.addParameter("dog_id", i.getDog_id())
					.addParameter("tags", i.getTags())
					.addParameter("status", i.getStatus())
					.executeUpdate();
			return uuid;
		}
	}

	@Override
	public String updateImage(Image i) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void deleteImage(String id) {
		try (Connection conn = sql2o.open()) {
			conn.createQuery(
							"delete from images where uuid=:id")
					.addParameter("id", id)
					.executeUpdate();
		}
	}

	@Override
	public Optional<DetailUser> authenticateUser(String user, String password) {
		try (Connection conn = sql2o.open()) {
			List<DetailUser> users = conn
					.createQuery(
							"select uuid, email, handle, confirmed, signup_date, confirm_date, deactivate_date, phone1, phone2, inapp_notifications from users where (email=:id or handle=:id) and password_hash=:password")
					.addParameter("id", user).addParameter("password", password)
					.executeAndFetch(DetailUser.class);
			if (users.size() == 1) {
				return Optional.of(users.get(0));
			} else {
				return Optional.empty();
			}
		}
	}

	@Override
	public String signupUser(UserSignup u) {
		try (Connection conn = sql2o.open()) {
			String confirmationToken = UUID.randomUUID().toString();
			String uuid = UUID.randomUUID().toString();
			conn.createQuery(
					"insert into users(uuid, email, handle, password_hash, confirmation_token)"
							+ "   VALUES (:uuid, :email, :handle, :password_hash, :confirmation_token)")
					.addParameter("uuid", uuid)
					.addParameter("email", u.getEmail())
					.addParameter("handle", u.getUserid())
					.addParameter("password_hash", u.getPassword())
					.addParameter("confirmation_token", confirmationToken).executeUpdate();
			return uuid;
		}
	}

	@Override
	public String updateImageStatus(String imageID, String dogId, String status) {
		try (Connection conn = sql2o.open()) {
			conn.createQuery(
					"update images SET dog_id=:dogId, status=:status where uuid=:uuid")
					.addParameter("uuid", imageID)
					.addParameter("dogId", dogId)
					.addParameter("status", status)
					.executeUpdate();
			return imageID;
		}
	}

	@Override
	public Optional<Image> getUnassignedImage(String userid) {
		try (Connection conn = sql2o.open()) {
			List<Image> images = conn.createQuery("select * from images where user_id=:userid and dog_id is null order by upload_date desc limit 1")
					.addParameter("userid", userid).executeAndFetch(Image.class);
			if (images.size() != 1) {
				return Optional.empty();
			}
			return Optional.of(images.get(0));
		}
	}

	@Override
	public List<IncidentBrief> getUserIncidents(String userId, String type) {
		try (Connection conn = sql2o.open()) {
			List<IncidentBrief> incidents = 
					conn.createQuery("select I.uuid as uuid, map_latitude, map_longitude, incident_date, state, resolution_id, reporter_id, D.uuid as dog_id, D.name as dog_name, D.color as dog_color, D.gender as dog_gender, D.basic_type as dog_basic_type from "
							+ "incidents I inner join dogs D on D.uuid=I.dog_id "
							+ "where reporter_id=:userId and resolution_id is " + (type.equals("open") ? "null" : "not null"))
					.addParameter("userId", userId)
					.executeAndFetch(IncidentBrief.class);
			return incidents;
		}
	}
}
