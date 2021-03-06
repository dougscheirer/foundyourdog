package com.foundyourdog.app.sql2o;

import java.sql.Timestamp;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.jasypt.exceptions.EncryptionOperationNotPossibleException;
import org.jasypt.util.password.BasicPasswordEncryptor;
import org.sql2o.Connection;
import org.sql2o.Sql2o;
import org.sql2o.Sql2oException;

import com.foundyourdog.app.handlers.incidents.model.IncidentBrief;
import com.foundyourdog.app.handlers.messages.model.DetailMessage;
import com.foundyourdog.app.handlers.users.ResetPassword;
import com.foundyourdog.app.handlers.users.model.DetailUser;
import com.foundyourdog.app.handlers.users.model.PublicUser;
import com.foundyourdog.app.handlers.users.model.UserSignup;
import com.foundyourdog.app.model.Dog;
import com.foundyourdog.app.model.Image;
import com.foundyourdog.app.model.Incident;
import com.foundyourdog.app.model.Model;
import com.foundyourdog.app.model.Message;
import com.foundyourdog.app.model.User;

public class Sql2oModel implements Model {
	final static Logger logger = LoggerFactory.getLogger(Sql2oModel.class);
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
		} catch (Sql2oException e) {
			logger.error(e.getLocalizedMessage());
		}
		return null;
	}

	@Override
	public Optional<DetailUser> getDetailUser(String id) {
		try (Connection conn = sql2o.open()) {
			List<DetailUser> users = conn
					.createQuery(
							"select uuid, email, handle, confirmed, signup_date, confirm_date, deactivate_date, phone1, phone2, inapp_notifications, admin from users where uuid=:id")
					.addParameter("id", id).executeAndFetch(DetailUser.class);
			if (users.size() != 1) {
				return Optional.empty();
			} else {
				return Optional.of(users.get(0));
			}
		} catch (Sql2oException e) {
			logger.error(e.getLocalizedMessage());
		}
		return null;
	}

	@Override
	public String createUser(User u) {
		try (Connection conn = sql2o.open()) {
			String uuid = UUID.randomUUID().toString();
			conn.createQuery(
					"insert into users(uuid, email, handle, password_hash, confirmation_token, phone1, phone2, inapp_notifications, admin)"
							+ "   VALUES (:uuid, :email, :handle, :password_hash, :confirmation_token, :phone1, :phone2, :inapp_notifications)")
					.addParameter("uuid", uuid).addParameter("email", u.getEmail())
					.addParameter("handle", u.getHandle()).addParameter("password_hash", u.getPassword_hash())
					.addParameter("confirmation_token", u.getConfirmation_token()).addParameter("phone1", u.getPhone1())
					.addParameter("phone2", u.getPhone2())
					.addParameter("inapp_notifications", u.isInapp_notifications()).addParameter("admin", false)
					.executeUpdate();
			return uuid;
		} catch (Sql2oException e) {
			logger.error(e.getLocalizedMessage());
		}
		return null;
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
			List<IncidentBrief> incidents = conn
					.createQuery("select I.uuid as uuid, map_latitude, map_longitude, incident_date, state, "
							+ "resolution_id, reporter_id, D.uuid as dog_id, D.name as dog_name, "
							+ "D.gender as dog_gender, " + "D.primary_type as dog_primary_type, "
							+ "D.secondary_type as dog_secondary_type, " + "D.primary_color as dog_primary_color, "
							+ "D.secondary_color as dog_secondary_color, " + "D.coat_type as dog_coat_type "
							+ "from incidents I " + "inner join dogs D on D.uuid=I.dog_id where I.state=:state "
							+ "order by I.incident_date desc")
					.addParameter("state", (lost) ? "lost" : "found").executeAndFetch(IncidentBrief.class);
			return incidents;
		} catch (Sql2oException e) {
			logger.error(e.getLocalizedMessage());
		}
		return null;
	}

	@Override
	public Optional<Dog> getDog(String id) {
		try (Connection conn = sql2o.open()) {
			List<Dog> dogs = conn.createQuery("select * from dogs where uuid=:id").addParameter("id", id)
					.executeAndFetch(Dog.class);
			if (dogs.size() != 1) {
				return Optional.empty();
			}
			return Optional.of(dogs.get(0));
		} catch (Sql2oException e) {
			logger.error(e.getLocalizedMessage());
		}
		return null;
	}

	@Override
	public String createDog(Dog d) {
		try (Connection conn = sql2o.open()) {
			String uuid = UUID.randomUUID().toString();
			conn.createQuery("insert into dogs (uuid, primary_type, secondary_type, primary_color, secondary_color, "
					+ "coat_type, gender, intact, owner_id, name, added_date, image_id) " + "values(:uuid, "
					+ ":primary_type, " + ":secondary_type, " + ":primary_color, " + ":secondary_color, "
					+ ":coat_type, " + ":gender, " + ":intact, " + ":owner_id, " + ":name, " + ":added_date, "
					+ ":image_id)").addParameter("uuid", uuid).addParameter("primary_type", d.getPrimary_type())
					.addParameter("secondary_type", d.getSecondary_type())
					.addParameter("primary_color", d.getPrimary_color())
					.addParameter("secondary_color", d.getSecondary_color()).addParameter("coat_type", d.getCoat_type())
					.addParameter("gender", d.getGender()).addParameter("intact", d.getIntact())
					.addParameter("owner_id", d.getOwner_id()).addParameter("name", d.getName())
					.addParameter("added_date", d.getAdded_date()).addParameter("image_id", d.getImage_id())
					.executeUpdate();

			return uuid;
		} catch (Sql2oException e) {
			logger.error(e.getLocalizedMessage());
		}
		return null;
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
			List<Incident> incidents = conn.createQuery("select * from incidents where uuid=:id").addParameter("id", id)
					.executeAndFetch(Incident.class);
			if (incidents.size() != 1) {
				return Optional.empty();
			}
			return Optional.of(incidents.get(0));
		} catch (Sql2oException e) {
			logger.error(e.getLocalizedMessage());
		}
		return null;
	}

	@Override
	public String createIncident(Incident i) {
		try (Connection conn = sql2o.open()) {
			String uuid = UUID.randomUUID().toString();
			conn.createQuery(
					"insert into incidents (uuid, map_latitude, map_longitude, reporter_id, dog_id, incident_date, state)"
							+ "values(" + ":uuid, " + ":map_latitude, " + ":map_longitude, " + ":reporter_id, "
							+ ":dog_id, " + ":incident_date, " + ":state)")
					.addParameter("uuid", uuid).addParameter("map_latitude", i.getMap_latitude())
					.addParameter("map_longitude", i.getMap_longitude()).addParameter("reporter_id", i.getReporter_id())
					.addParameter("dog_id", i.getDog_id()).addParameter("incident_date", i.getIncident_date())
					.addParameter("state", i.getState()).executeUpdate();

			return uuid;
		} catch (Sql2oException e) {
			logger.error(e.getLocalizedMessage());
		}
		return null;
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
			List<Image> images = conn.createQuery("select * from images where uuid=:id").addParameter("id", id)
					.executeAndFetch(Image.class);
			if (images.size() != 1) {
				return Optional.empty();
			}
			return Optional.of(images.get(0));
		} catch (Sql2oException e) {
			logger.error(e.getLocalizedMessage());
		}
		return null;
	}

	@Override
	public String createImage(Image i) {
		try (Connection conn = sql2o.open()) {
			String uuid = UUID.randomUUID().toString();
			conn.createQuery(
					"insert into images(uuid, user_id, image_location, upload_date, tags, dog_id, status) VALUES ("
							+ ":uuid, " + ":user_id, " + ":image_location, " + ":upload_date, " + ":tags, "
							+ ":dog_id, " + ":status)")
					.addParameter("uuid", uuid).addParameter("user_id", i.getUser_id())
					.addParameter("image_location", i.getImage_location())
					.addParameter("upload_date", i.getUpload_date()).addParameter("dog_id", i.getDog_id())
					.addParameter("tags", i.getTags()).addParameter("status", i.getStatus()).executeUpdate();
			return uuid;
		} catch (Sql2oException e) {
			logger.error(e.getLocalizedMessage());
		}
		return null;
	}

	@Override
	public boolean updateImage(Image i) {
		try (Connection conn = sql2o.open()) {
			conn.createQuery(
					"UPDATE IMAGES SET user_id=:user_id, image_location=:image_location, upload_date=:upload_date, tags=:tags, dog_id=:dog_id, status=:status WHERE uuid=:uuid")
					.addParameter("uuid", i.getUuid()).addParameter("user_id", i.getUser_id())
					.addParameter("image_location", i.getImage_location())
					.addParameter("upload_date", i.getUpload_date()).addParameter("dog_id", i.getDog_id())
					.addParameter("tags", i.getTags()).addParameter("status", i.getStatus()).executeUpdate();
			return true;
		} catch (Sql2oException e) {
			logger.error(e.getLocalizedMessage());
		}
		return false;
	}

	@Override
	public boolean deleteImage(String id) {
		try (Connection conn = sql2o.open()) {
			conn.createQuery("delete from images where uuid=:id").addParameter("id", id).executeUpdate();
			return true;
		} catch (Sql2oException e) {
			logger.error(e.getLocalizedMessage());
		}
		return false;
	}

	@Override
	public Optional<DetailUser> authenticateUser(String user, String password) {
		try (Connection conn = sql2o.open()) {
			List<Map<String, Object>> passwords = conn.createQuery(
							"select uuid, password_hash from users where (email=:id or handle=:id)")
					.addParameter("id", user)
					.executeAndFetchTable().asList();
			if (passwords.size() == 1) {
				try {
					BasicPasswordEncryptor passwordEncryptor = new BasicPasswordEncryptor();
					if (passwordEncryptor.checkPassword(password, passwords.get(0).get("password_hash").toString())) {
						return getDetailUser(passwords.get(0).get("uuid").toString());
					}
				} catch (EncryptionOperationNotPossibleException e) {
					// usually means that the pasword_hash is not a valid "encrypted value"
				}
			} 
			
			return Optional.empty();
		} catch (Sql2oException e) {
			logger.error(e.getLocalizedMessage());
		}
		return null;
	}

	@Override
	public String signupUser(UserSignup u) {
		try (Connection conn = sql2o.open()) {
			String confirmationToken = UUID.randomUUID().toString();
			String uuid = UUID.randomUUID().toString();
			conn.createQuery("insert into users(uuid, email, handle, password_hash, confirmation_token)"
					+ "   VALUES (:uuid, :email, :handle, :password_hash, :confirmation_token)")
					.addParameter("uuid", uuid)
					.addParameter("email", u.getEmail())
					.addParameter("handle", u.getUserid())
					.addParameter("password_hash", u.getPassword())
					.addParameter("confirmation_token", confirmationToken).executeUpdate();
			return uuid;
		} catch (Sql2oException e) {
			logger.error(e.getLocalizedMessage());
		}
		return null;
	}

	@Override
	public String updateImageStatus(String imageID, String dogId, String status) {
		try (Connection conn = sql2o.open()) {
			conn.createQuery("update images SET dog_id=:dogId, status=:status where uuid=:uuid")
					.addParameter("uuid", imageID).addParameter("dogId", dogId).addParameter("status", status)
					.executeUpdate();
			return imageID;
		} catch (Sql2oException e) {
			logger.error(e.getLocalizedMessage());
		}
		return null;
	}

	@Override
	public Optional<Image> getUnassignedImage(String userid) {
		try (Connection conn = sql2o.open()) {
			List<Image> images = conn
					.createQuery(
							"select * from images where user_id=:userid and dog_id is null order by upload_date desc limit 1")
					.addParameter("userid", userid).executeAndFetch(Image.class);
			if (images.size() != 1) {
				return Optional.empty();
			}
			return Optional.of(images.get(0));
		} catch (Sql2oException e) {
			logger.error(e.getLocalizedMessage());
		}
		return null;
	}

	@Override
	public List<IncidentBrief> getUserIncidents(String userId, String type) {
		try (Connection conn = sql2o.open()) {
			List<IncidentBrief> incidents = conn.createQuery(
					"select I.uuid as uuid, map_latitude, map_longitude, incident_date, state, resolution_id, "
							+ "reporter_id, D.uuid as dog_id, D.name as dog_name, " + "D.gender as dog_gender, "
							+ "D.coat_type as dog_coat_type, " + "D.primary_type as dog_primary_type, "
							+ "D.secondary_type as dog_secondary_type, " + "D.primary_color as dog_primary_color, "
							+ "D.secondary_color as dog_secondary_color "
							+ "from incidents I inner join dogs D on D.uuid=I.dog_id "
							+ "where reporter_id=:userId and resolution_id is "
							+ (type.equals("open") ? "null" : "not null"))
					.addParameter("userId", userId).executeAndFetch(IncidentBrief.class);
			return incidents;
		} catch (Sql2oException e) {
			logger.error(e.getLocalizedMessage());
		}
		return null;
	}

	@Override
	public List<DetailMessage> getUserMessages(String userId, String type) {
		try (Connection conn = sql2o.open()) {
			return conn
					.createQuery("SELECT "
							+ "M.uuid, M.incident_id, M.receiver_id, M.sent_date, M.sender_id, M.receiver_read, M.receiver_delete, M.message, M.receiver_flagged, M.responding_to, "
							+ "from_users.handle as sender_handle, to_users.handle AS receiver_handle FROM messages M "
							+ "JOIN users AS from_users on M.sender_id = from_users.uuid "
							+ "JOIN users AS to_users on M.receiver_id = to_users.uuid "
							+ "WHERE (receiver_id=:userid OR sender_id=:userid) AND receiver_read=:read AND receiver_delete=false "
							+ "ORDER BY sent_date DESC")
					.addParameter("userid", userId).addParameter("read", type.equals("read"))
					.executeAndFetch(DetailMessage.class);
		} catch (Sql2oException e) {
			logger.error(e.getLocalizedMessage());
		}
		return null;
	}

	@Override
	public String createMessage(Message n) {
		try (Connection conn = sql2o.open()) {
			String uuid = UUID.randomUUID().toString();
			conn.createQuery(
					"insert into messages(uuid, incident_id, receiver_id, sent_date, sender_id, message, responding_to) "
							+ "values (:uuid, :incident_id, :receiver_id, :sent_date, :sender_id, :message, :responding_to);")
					.addParameter("uuid", uuid).addParameter("incident_id", n.getIncident_id())
					.addParameter("receiver_id", n.getReceiver_id()).addParameter("sent_date", n.getSent_date())
					.addParameter("sender_id", n.getSender_id()).addParameter("message", n.getMessage())
					.addParameter("responding_to", n.getResponding_to()).executeUpdate();
			return uuid;
		} catch (Sql2oException e) {
			logger.error(e.getLocalizedMessage());
		}
		return null;
	}

	@Override
	public Optional<Message> getMessage(String incident_id) {
		try (Connection conn = sql2o.open()) {
			List<Message> list = conn.createQuery("select * from messages where uuid=:uuid").addParameter("uuid", incident_id).executeAndFetch(Message.class);
			if (list.isEmpty() || list.size() != 1)
				return Optional.empty();
			else
				return Optional.of(list.get(0));
		} catch (Sql2oException e) {
			logger.error(e.getLocalizedMessage());
		}
		return null;
	}

	@Override
	public List<Message> getConversation(String incident_id, String id1, String id2, int ordinal_start) {
		try (Connection conn = sql2o.open()) {
			return conn.createQuery("select * from messages where incident_id=:incident "
					+ "AND (receiver_id=:id1 OR sender_id=:id1) "
					+ "AND (receiver_id=:id2 OR sender_id=:id2) "
					+ "AND ordinal > :ordinal_start "
					+ "ORDER BY sent_date DESC")
					.addParameter("incident", incident_id)
					.addParameter("id1", id1)
					.addParameter("id2", id2)
					.addParameter("ordinal_start", ordinal_start)
					.executeAndFetch(Message.class);
		} catch (Sql2oException e) {
			logger.error(e.getLocalizedMessage());
		}
		return null;
	}

	@Override
	public boolean markConversation(String incident_id, String id1, String id2, String curUserId, int ordinal_start, boolean read) {
		try (Connection conn = sql2o.open()) {
			conn.createQuery("update messages set receiver_read=:read where incident_id=:incident "
					+ "AND (receiver_id=:id1 OR sender_id=:id1) "
					+ "AND (receiver_id=:id2 OR sender_id=:id2) "
					+ "AND receiver_id=:curUserId "
					+ "AND ordinal > :ordinal_start")
					.addParameter("incident", incident_id)
					.addParameter("id1", id1)
					.addParameter("id2", id2)
					.addParameter("curUserId", curUserId)
					.addParameter("ordinal_start", ordinal_start)
					.addParameter("read", read)
					.executeUpdate();
			return true;
		} catch (Sql2oException e) {
			logger.error(e.getLocalizedMessage());
		}
		return false;
	}

	@Override
	public Optional<DetailUser> getDetailUserFromEmail(String email) {
		try (Connection conn = sql2o.open()) {
			List<DetailUser> users = conn
					.createQuery(
							"select uuid, email, handle, confirmed, signup_date, confirm_date, deactivate_date, phone1, phone2, inapp_notifications, admin from users where email=:email")
					.addParameter("email", email)
					.executeAndFetch(DetailUser.class);
			if (users.size() != 1) {
				return Optional.empty();
			} else {
				return Optional.of(users.get(0));
			}
		} catch (Sql2oException e) {
			logger.error(e.getLocalizedMessage());
		}
		return null;
	}

	@Override
	public String updatePasswordResetToken(String email) {
		// only allow them to be live for 24 hrs
		try (Connection conn = sql2o.open()) {
			Timestamp now = new Timestamp(System.currentTimeMillis());
			String resetToken = UUID.randomUUID().toString();
			conn.createQuery(
					"UPDATE users SET password_reset_token=:token, password_reset_time=:time WHERE email=:email")
					.addParameter("token", resetToken)
					.addParameter("email", email)
					.addParameter("time", now)
					.executeUpdate();
			return resetToken;
		} catch (Sql2oException e) {
			logger.error(e.getLocalizedMessage());
		}
		return null;
	}

	@Override
	public boolean resetPassword(ResetPassword reset) {
		// only allow them to be live for 24 hrs
		try (Connection conn = sql2o.open()) {
			long now = System.currentTimeMillis();
			BasicPasswordEncryptor passwordEncryptor = new BasicPasswordEncryptor();
			return (conn.createQuery(
					"UPDATE users SET password_hash=:password, password_reset_token=null, password_reset_time=null WHERE email=:email AND password_reset_token=:token AND password_reset_time > :timeout")
					.addParameter("email", reset.getEmail())
					.addParameter("password", passwordEncryptor.encryptPassword(reset.getPassword()))
					.addParameter("timeout", new Timestamp(now - 1000*60*24))
					.addParameter("token", reset.getReset_token())
					.executeUpdate().getResult() == 1);
		} catch (Sql2oException e) {
			logger.error(e.getLocalizedMessage());
		}
		return false;
	}

	@Override
	public int getUnreadMessages(String receiver_id) {
		try (Connection conn = sql2o.open()) {
			return conn.createQuery("SELECT COUNT(uuid) FROM messages WHERE receiver_id=:id AND receiver_read=false")
				.addParameter("id", receiver_id)
				.executeScalar(Integer.class);
		} catch (Sql2oException e) {
			logger.error(e.getLocalizedMessage());
		}
		return -1;
	}
}
