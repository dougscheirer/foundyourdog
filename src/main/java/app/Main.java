package app;

import static spark.Spark.*;
import spark.Request;
import spark.Response;

import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Stream;

import org.eclipse.jetty.http.HttpCookie;
import org.eclipse.jetty.websocket.api.RemoteEndpoint;
import org.eclipse.jetty.websocket.api.Session;
import org.sql2o.Connection;
import org.sql2o.Sql2o;
import org.sql2o.Sql2oException;
import org.sql2o.quirks.PostgresQuirks;

import com.beust.jcommander.JCommander;
import com.fasterxml.jackson.databind.ObjectMapper;

import app.handlers.AuthenticatedHandler;
import app.handlers.CreateIncidentReportHandler;
import app.handlers.CreateNotificationHandler;
import app.handlers.CreateUserHandler;
import app.handlers.DeleteNotificationHandler;
import app.handlers.DetailUser;
import app.handlers.EmptyPayload;
import app.handlers.FindUnassignedImageHandler;
import app.handlers.GetConversationHandler;
import app.handlers.GetImageHandler;
import app.handlers.GetIncidentDetailHandler;
import app.handlers.GetIncidentsHandler;
import app.handlers.GetUserIncidents;
import app.handlers.GetUserNotifications;
import app.handlers.GetUsersIndexHandler;
import app.handlers.ImageDeleteHandler;
import app.handlers.ImageUploadHandler;
import app.handlers.LoginHandler;
import app.handlers.LogoutHandler;
import app.handlers.UpdateNotificationHandler;
import app.handlers.WebsocketHandler;
import app.model.Model;
import app.sql2o.Sql2oModel;
import spark.Spark;

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

	private static void checkAdminAuthentication(Request request, Response res) {
		DetailUser u = getCurrentUser(request);
		if (u == null || !u.isAdmin())
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
			conn.createQuery("select * from users limit 1").executeAndFetchTable();
		} catch (Sql2oException e) {
			logger.log(Level.SEVERE, e.toString(), e);
			return;
		}

		Model model = new Sql2oModel(sql2o);

		Spark.staticFileLocation("/public");

		// websockets: we got em
		webSocket("/ws", WebsocketHandler.class);

		// authentication filter
		/*
		 * the pattern here is: /api/auth : requires authenticated user session
		 * /api/admin: requires authenticated admin session (anything else): no
		 * auth required
		 */
		before((request, response) -> {
			if (request.pathInfo().startsWith("/api/auth/")) {
				checkAuthentication(request, response);
			} else if (request.pathInfo().startsWith("/api/admin/")) {
				checkAdminAuthentication(request, response);
			} else {
				// it's legit
			}
		});

		// add all of the handlers here
		redirect.get("/", "/index.html");

		// basics, login, logout, and an auth check method
		post("/api/login", new LoginHandler(model));
		post("/api/logout", new LogoutHandler(model));

		get("/api/auth/authenticated", new AuthenticatedHandler(model));

		// TODO: group the /api/... stuff under one route path?
		post("/api/signup", new CreateUserHandler(model));
		get("/api/admin/users", new GetUsersIndexHandler(model));
		// put("/api/users/:id", new UpdateUserHandler(model));
		// delete("/api/users/:id", new DeleteUserHandler(model));

		get("/api/auth/reports", new GetUserIncidents(model));

		get("/api/dogs/lost", new GetIncidentsHandler(GetIncidentsHandler.IncidentType.LOST, model));
		get("/api/dogs/found", new GetIncidentsHandler(GetIncidentsHandler.IncidentType.FOUND, model));

		post("/api/auth/lost/new", new CreateIncidentReportHandler(model, GetIncidentsHandler.IncidentType.LOST));
		post("/api/auth/found/new", new CreateIncidentReportHandler(model, GetIncidentsHandler.IncidentType.FOUND));
		get("/api/reports/:id", new GetIncidentDetailHandler(model));

		post("/api/auth/report/images/new", new ImageUploadHandler(model, options.imageLocation));
		delete("/api/auth/report/images/:id", new ImageDeleteHandler(model));
		get("/api/auth/reports/images/unassigned", new FindUnassignedImageHandler(model));

		get("/api/auth/messages", new GetUserNotifications(model));
		post("/api/auth/message", new CreateNotificationHandler(model));
		put("/api/auth/message/:id?mark=:flag", new UpdateNotificationHandler(model));
		delete("/api/auth/message/:id", new DeleteNotificationHandler(model));

		get("/api/auth/conversation", new GetConversationHandler(model));

		// what is java bad about? serving static image files, so change this
		// when really using it
		get("/api/images/:id", new GetImageHandler(model));

		// a little api for retreiving the websocket addr
		get("/api/wsaddr", (req, res) -> {
			return "{\"address\":\""
					+ req.url().replace(req.scheme(), "ws").replaceAll(req.pathInfo(), "/ws") 
					+ "\"}";
		});
		
		exception(Exception.class, (exception, request, response) -> {
			// Handle the exception here
			logger.severe("Exception handling route: " + request.url());
			logger.severe(exception.getLocalizedMessage());
		});
	}
}