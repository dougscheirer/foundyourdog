package app;

import static spark.Spark.*;

import java.util.logging.Level;
import java.util.logging.Logger;

import org.sql2o.Connection;
import org.sql2o.Sql2o;
import org.sql2o.Sql2oException;
import org.sql2o.quirks.PostgresQuirks;

import com.beust.jcommander.JCommander;

import app.handlers.CreateUserHandler;
import app.handlers.GetDogsHandler;
import app.handlers.GetIncidentsHandler;
import app.handlers.GetUsersIndexHandler;
import app.model.Model;
import app.sql2o.Sql2oModel;
import freemarker.cache.ClassTemplateLoader;
import freemarker.template.Configuration;
import spark.Spark;
import spark.template.freemarker.FreeMarkerEngine;

public class Main {
	final static Logger logger = Logger.getLogger(Main.class.getCanonicalName());

    static int getPortByEnv(int optionsPort) {
        ProcessBuilder processBuilder = new ProcessBuilder();
        if (processBuilder.environment().get("PORT") != null) {
            return Integer.parseInt(processBuilder.environment().get("PORT"));
        }
		return optionsPort;
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

		// add all of the handlers here
		redirect.get("/", "/index.html");
		// TODO: group the /api/... stuff under one route path? 
		post("/api/users/new", new CreateUserHandler(model));
		get("/api/users", new GetUsersIndexHandler(model));
		// put("/api/users/:id", new UpdateUserHanlder(model));
		// delete("/api/users/:id", new DeleteUserHandler(model));
		get("/api/dogs/lost", new GetIncidentsHandler(GetIncidentsHandler.IncidentType.LOST, model));
		get("/api/dogs/found", new GetIncidentsHandler(GetIncidentsHandler.IncidentType.FOUND, model));
	}
}
