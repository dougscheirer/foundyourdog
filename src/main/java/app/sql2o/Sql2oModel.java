package app.sql2o;

import java.sql.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.sql2o.Connection;
import org.sql2o.Query;
import org.sql2o.Sql2o;

import app.model.Dog;
import app.model.Image;
import app.model.Incident;
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
							"select uuid, email, handle, confirmed, signup_date, confirm_date, deactivate_date, phone1, phone2, inapp_notifications from users where uuid=:id")
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
					"insert into users(uuid, email, handle, password_hash, confirmation_token, phone1, phone2, inapp_notifications)"
							+ "   VALUES (:uuid, :email, :handle, :password_hash, :confirmation_token, :phone1, :phone2, :inapp_notifications)")
					.addParameter("uuid", uuid)
					.addParameter("email", u.getEmail())
					.addParameter("handle", u.getHandle())
					.addParameter("password_hash", u.getPassword_hash())
					.addParameter("confirmation_token", u.getConfirmation_token())
					.addParameter("phone1", u.getPhone1())
					.addParameter("phone2", u.getPhone2())
					.addParameter("inapp_notifications", u.getInapp_notifications())
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
	public List<Incident> getAllIncidents(boolean lost) {
		try (Connection conn = sql2o.open()) {
			List<Incident> incidents = conn.createQuery("select * from incidents where state=:state")
					.addParameter("state", (lost) ? "lost" : "found").executeAndFetch(Incident.class);
			return incidents;
		}
	}

	@Override
	public Optional<Dog> getDog(String id) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String createDog(Dog d) {
		try (Connection conn = sql2o.open()) {
			String confirmationToken = UUID.randomUUID().toString();
			String uuid = UUID.randomUUID().toString();
			Query q = conn.createQuery(
					"insert into dogs (uuid, basic_type, color, gender, intact, owner_id, name, added_date)" +
					"values(:uuid, :basic_type, :color, :gender, :intact, :owner_id, :name, :added_date)");
			q.addParameter("uuid", uuid);
			q.addParameter("basic_type", d.getBasic_type());
			q.addParameter("color", d.getColor());
			q.addParameter("gender", d.getGender());
			q.addParameter("intact", d.getIntact());
			q.addParameter("owner_id", d.getOwner_id());
			q.addParameter("name", d.getName());
			q.addParameter("added_date", d.getAdded_date());
			q.executeUpdate();
			
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
		// TODO Auto-generated method stub
		return null;
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
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String createImage(Image i) {
		try (Connection conn = sql2o.open()) {
			String uuid = UUID.randomUUID().toString();
			conn.createQuery(
					"insert into images(uuid, user_id, image_location, upload_date, tags, dog_id)"
							+ "   VALUES (:uuid, :user_id, :image_location, :upload_date, :tags, :dog_id)")
					.addParameter("uuid", uuid)
					.addParameter("user_id", i.getUser_id())
					.addParameter("image_location", i.getImage_location())
					.addParameter("upload_date", i.getUpload_date())
					.addParameter("dog_id", i.getDog_id())
					.addParameter("tags", i.getTags()).executeUpdate();
			return uuid;
		}
	}

	@Override
	public String updateImage(Image i) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String deleteImage(String id) {
		// TODO Auto-generated method stub
		return null;
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
}
