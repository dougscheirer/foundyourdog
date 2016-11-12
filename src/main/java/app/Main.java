package app;

import static spark.Spark.*;
import spark.Request;
import spark.Response;

import java.util.Optional;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.sql2o.Connection;
import org.sql2o.Sql2o;
import org.sql2o.Sql2oException;
import org.sql2o.quirks.PostgresQuirks;

import com.beust.jcommander.JCommander;

import app.handlers.AuthenticatedHandler;
import app.handlers.CreateIncidentReportHandler;
import app.handlers.CreateUserHandler;
import app.handlers.DetailUser;
import app.handlers.FindUnassignedImageHandler;
import app.handlers.GetDogsHandler;
import app.handlers.GetImageHandler;
import app.handlers.GetIncidentDetailHandler;
import app.handlers.GetIncidentsHandler;
import app.handlers.GetUsersIndexHandler;
import app.handlers.ImageDeleteHandler;
import app.handlers.ImageUploadHandler;
import app.handlers.LoginHandler;
import app.handlers.LogoutHandler;
import app.model.Model;
import app.sql2o.Sql2oModel;
import freemarker.cache.ClassTemplateLoader;
import freemarker.template.Configuration;
import spark.Spark;
import spark.template.freemarker.FreeMarkerEngine;

public class Main {
	final static Logger logger = Logger.getLogger(Main.class.getCanonicalName());
	
	// TODO: move this to where constants live
	public static final String SESSION_USERID = "userid";
	public static DetailUser getCurrentUser(Request request) {
		return request.session().attribute(SESSION_USERID);
	}
		
    static int getPortByEnv(int optionsPort) {
        ProcessBuilder processBuilder = new ProcessBuilder();
        if (processBuilder.environment().get("PORT") != null) {
            return Integer.parseInt(processBuilder.environment().get("PORT"));
        }
		return optionsPort;
    }

    private static void checkAuthentication(Request request, Response res) {
    	if (getCurrentUser(request) == null)
    		halt(403);
    }

	public static void main(String[] args) {
		CommandLineOptions options = new CommandLineOptions();
		new JCommander(options, args);

		logger.finest("Options.debug = " + options.debug);
		logger.finest("Options.database = " + options.database);
		logger.finest("Options.dbHost = " + options.dbHost);
		logger.finest("Options.dbUsername = " + options.dbUsername);
		logger.finest("Options.dbPort = " + options.dbPort);
		int servicePort = getPortByEnv(options.servicePort);
		logger.finest("servicePort = " + servicePort);
		logger.finest("image location = " + options.imageLocation);

		port(servicePort);

		Sql2o sql2o = new Sql2o("jdbc:postgresql://" + options.dbHost + ":" + options.dbPort + "/" + options.database,
				options.dbUsername, options.dbPassword, new PostgresQuirks() {
					{
					}
				});

		// do a basic DB connection test on the users table, quit if it fails
        try (Connection conn = sql2o.open()) {
        	conn.createQuery("select * from users limit 1")
        		.executeAndFetchTable();
		} catch (Sql2oException e) {
			logger.log(Level.SEVERE, e.toString(), e);
			return;
		}

		Model model = new Sql2oModel(sql2o);

		Spark.staticFileLocation("/public");

		// authentication filter
		before((request, response) -> {
			String[] endsWith = { "/new", "/authenticated" };
			for ( String s : endsWith ) {
				if (request.pathInfo().endsWith(s)) {
					checkAuthentication(request, response);
				}
			}
		});

		// add all of the handlers here
		redirect.get("/", "/index.html");

		// basics, login, logout, and an auth check method
		post("/login", new LoginHandler(model));
		post("/logout", new LogoutHandler(model));
		get("/authenticated", new AuthenticatedHandler(model));

		// TODO: group the /api/... stuff under one route path?
		post("/signup", new CreateUserHandler(model));
		get("/api/users", new GetUsersIndexHandler(model));
		// put("/api/users/:id", new UpdateUserHanlder(model));
		// delete("/api/users/:id", new DeleteUserHandler(model));
		
		get("/api/dogs/lost", new GetIncidentsHandler(GetIncidentsHandler.IncidentType.LOST, model));
		get("/api/dogs/found", new GetIncidentsHandler(GetIncidentsHandler.IncidentType.FOUND, model));
		
		post("/api/lost/new", new CreateIncidentReportHandler(model, GetIncidentsHandler.IncidentType.LOST));
		post("/api/found/new", new CreateIncidentReportHandler(model, GetIncidentsHandler.IncidentType.FOUND));
		get("/reports/:id", new GetIncidentDetailHandler(model));
		
		post("/report/images/new", new ImageUploadHandler(model, options.imageLocation));
		delete("/report/images/:id", new ImageDeleteHandler(model));
		get("/reports/images/unassigned", new FindUnassignedImageHandler(model));
		
		// what is java bad about? serving static image files, so change this when really using it
		get("/api/images/:id", new GetImageHandler(model));
	}
}
