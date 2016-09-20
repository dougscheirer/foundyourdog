package app.sql2o;

import java.sql.Date;
import java.util.List;
import java.util.Optional;

import org.sql2o.Connection;
import org.sql2o.Sql2o;

import app.model.Dog;
import app.model.Image;
import app.model.Incident;
import app.model.Model;
import app.model.User;
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
            List<PublicUser> users = conn.createQuery("select id, email, handle, confirmed, signup_date, confirm_date, deactivate_date from users order by id")
                    .executeAndFetch(PublicUser.class);
            return users;
        }
	}

	@Override
	public Optional<DetailUser> getDetailUser(int id) {
        try (Connection conn = sql2o.open()) {
            List<DetailUser> users = conn.createQuery("select id, email, handle, confirmed, signup_date, confirm_date, deactivate_date, phone1, phone2, inapp_notifications from users where id=:id")
            		.addParameter("id", id)
                    .executeAndFetch(DetailUser.class);
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
	public int createUser(User u) {
        try (Connection conn = sql2o.open()) {
            conn.createQuery("insert into users(email, handle, password_hash, confirmation_token, phone1, phone2, inapp_notifications)" +
            				 "   VALUES (:email, :handle, :password_hash, :confirmation_token, :phone1, :phone2, :inapp_notifications)")
                    .addParameter("email", u.getEmail())
                    .addParameter("handle", u.getHandle())
                    .addParameter("password_hash", u.getPassword_hash())
                    .addParameter("confirmation_token", u.getConfirmation_token())
                    .addParameter("phone1", u.getPhone1())
                    .addParameter("phone2", u.getPhone2())
                    .addParameter("inapp_notifications", u.getInapp_notifications())
                    .executeUpdate();
            List<Integer> ids = conn.createQuery("select id from users where email=:email")
            		.addParameter("email", u.getEmail())
            		.executeScalarList(Integer.class);
            if (ids.size() == 1) {
            	return ids.get(0);
            } else {
            	throw new RuntimeException();
            }
        }
	}

	@Override
	public int updateUser(User u) {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public int deleteUser(int id) {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public List<Dog> getAllDogs() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Optional<Dog> getDog(int id) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public int createDog(Dog d) {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public int updateDog(Dog d) {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public int deleteDog(int id) {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public List<Incident> getAllIncidents() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Optional<Incident> getIncident(int id) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public int createIncident(Incident i) {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public int updateIncident(Incident i) {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public int deleteIncident(int id) {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public List<Image> getAllImages() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Optional<Image> getImage(int id) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public int createImage(Image i) {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public int updateImage(Image i) {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public int deleteImage(int id) {
		// TODO Auto-generated method stub
		return 0;
	}
}
