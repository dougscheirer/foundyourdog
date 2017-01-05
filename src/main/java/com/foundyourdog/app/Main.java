package com.foundyourdog.app;

import static spark.Spark.*;
import spark.Request;
import spark.Response;

import java.io.InputStream;
import java.net.URISyntaxException;
import java.util.Base64;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.sql2o.Connection;
import org.sql2o.Sql2o;
import org.sql2o.Sql2oException;
import org.sql2o.quirks.PostgresQuirks;

import com.beust.jcommander.JCommander;
import com.foundyourdog.app.db.DBConnection;
import com.foundyourdog.app.exceptions.NotConsumedException;
import com.foundyourdog.app.exceptions.NotFoundException;
import com.foundyourdog.app.handlers.WebsocketHandler;
import com.foundyourdog.app.handlers.auth.AuthenticatedHandler;
import com.foundyourdog.app.handlers.auth.LoginHandler;
import com.foundyourdog.app.handlers.auth.LogoutHandler;
import com.foundyourdog.app.handlers.images.FindUnassignedImageHandler;
import com.foundyourdog.app.handlers.images.GetImageHandler;
import com.foundyourdog.app.handlers.images.ImageDeleteHandler;
import com.foundyourdog.app.handlers.images.ImageUploadFileHandler;
import com.foundyourdog.app.handlers.images.ImageUploadHandler;
import com.foundyourdog.app.handlers.images.ImageUploadUpdateHandler;
import com.foundyourdog.app.handlers.incidents.CreateIncidentReportHandler;
import com.foundyourdog.app.handlers.incidents.GetIncidentDetailHandler;
import com.foundyourdog.app.handlers.incidents.GetIncidentsHandler;
import com.foundyourdog.app.handlers.incidents.GetUserIncidents;
import com.foundyourdog.app.handlers.messages.CreateMessageHandler;
import com.foundyourdog.app.handlers.messages.DeleteMessageHandler;
import com.foundyourdog.app.handlers.messages.GetConversationHandler;
import com.foundyourdog.app.handlers.messages.GetUserMessagesHandler;
import com.foundyourdog.app.handlers.messages.MarkConversationHandler;
import com.foundyourdog.app.handlers.messages.UpdateMessageHandler;
import com.foundyourdog.app.handlers.users.CreateUserHandler;
import com.foundyourdog.app.handlers.users.GetUsersIndexHandler;
import com.foundyourdog.app.handlers.users.ResetPasswordHandler;
import com.foundyourdog.app.handlers.users.ResetPasswordRequestHandler;
import com.foundyourdog.app.handlers.users.model.DetailUser;
import com.foundyourdog.app.model.Model;
import com.foundyourdog.app.sql2o.Sql2oModel;
import spark.Spark;
import spark.utils.IOUtils;

public class Main {
	final static Logger logger = LoggerFactory.getLogger(Main.class);

	// TODO: move this to where constants live
	public static final String SESSION_USERID = "userid";

	public static DetailUser getCurrentUser(Request request) {
		return request.session().attribute(SESSION_USERID);
	}

	private static int getPortByEnv(int optionsPort) {
		String port = ConfigConsts.getPort();
		if (!port.isEmpty()) {
			return Integer.parseInt(port);
		}
		return optionsPort;
	}

	private static void checkAuthentication(Request request, Response res) {
		if (getCurrentUser(request) == null)
			halt(401);
	}

	private static void checkAdminAuthentication(Request request, Response res) {
		DetailUser u = getCurrentUser(request);
		if (u == null || !u.isAdmin())
			halt(401);
	}

	private static boolean checkBasicAuth(Request req, Response res, String authCred) {
		String auth = req.headers("Authorization");
		if (auth != null && auth.startsWith("Basic")) {
			String b64Credentials = auth.substring("Basic".length()).trim();
			String credentials = new String(Base64.getDecoder().decode(b64Credentials));
			if (credentials.equals(authCred)) {
				logger.debug("Auth PROVIDED for " + req.pathInfo());
				return true;
			}
			logger.debug("Auth INCORRECT for " + req.pathInfo());
		}

		logger.debug("Auth NOT PROVIDED for " + req.pathInfo());
		res.header("WWW-Authenticate", "Basic realm=\"Restricted\"");
		res.body("Authentication required");
		res.status(401);
		return false;
	}

	private static boolean isOtherHandler(String path) {
		return path.equals("/ws") ||
				path.equals("/favicon.ico") ||
				path.startsWith("/img/") ||
				path.startsWith("/static/");
	}

	public static String assumeHTTPS(Request req) {
		return (ConfigConsts.getAssumeHTTPS()) ? "https" : req.scheme(); 
	}
	
	public static void main(String[] args) {
		CommandLineOptions options = new CommandLineOptions();
		new JCommander(options, args);

		// some things from command line options
		logger.debug("Options.debug = " + options.debug);
		int servicePort = getPortByEnv(options.servicePort);
		logger.debug("servicePort = " + servicePort);
		logger.debug("image location = " + options.imageLocation);

		// some things from the environment (DB params are elsewhere)
		String basicAuth = ConfigConsts.getBasicAuth();
		boolean wsDevMode = ConfigConsts.getWSDevMode();

		port(servicePort);

		Sql2o sql2o = null;

		try {
			sql2o = new Sql2o(DBConnection.getUrl(), DBConnection.getUser(), DBConnection.getPassword(),
					new PostgresQuirks() {
						{
						}
					});
		} catch (URISyntaxException e1) {
			logger.error(e1.getMessage());
		}

		// do a basic DB connection test on the users table, quit if it fails
		try (Connection conn = sql2o.open()) {
			conn.createQuery("select * from users limit 1").executeAndFetchTable();
		} catch (Sql2oException e) {
			logger.error(e.toString(), e);
			return;
		}

		Model model = new Sql2oModel(sql2o);

		Spark.staticFileLocation("/public");

		// websockets: we got em
		webSocket("/ws", WebsocketHandler.class);

		// authentication filters
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

		// basics, login, logout, and an auth check method
		post("/api/login", new LoginHandler(model));
		post("/api/logout", new LogoutHandler(model));
		post("/api/reset_password_request", new ResetPasswordRequestHandler(model));
		post("/api/reset_password", new ResetPasswordHandler(model));

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

		// complicated, but here goes:
		// "new" - start the process, create the DB entry, return enough info to xfer the file in the next step
		CloudinaryOpts opts = new CloudinaryOpts();
		post("/api/auth/report/images/new", new ImageUploadHandler(model, opts));
		// "upload" - actually xfer the file (dev only, prod goes to cloudinary)
		post("/api/auth/report/images/upload/:id", new ImageUploadFileHandler(model, options.imageLocation));
		// ":id" - update the DB record to show the file is in cloudinary now, that we have the data for it, etc.
		put("/api/auth/report/images/:id", new ImageUploadUpdateHandler(model, opts));
		
		delete("/api/auth/report/images/:id", new ImageDeleteHandler(model, opts));
		get("/api/auth/reports/images/unassigned", new FindUnassignedImageHandler(model));

		get("/api/auth/messages", new GetUserMessagesHandler(model));
		post("/api/auth/message", new CreateMessageHandler(model));
		put("/api/auth/message/:id", new UpdateMessageHandler(model));
		delete("/api/auth/message/:id", new DeleteMessageHandler(model));

		get("/api/auth/conversation", new GetConversationHandler(model));
		post("/api/auth/mark", new MarkConversationHandler(model));

		// what is java bad about? serving static image files, so change this
		// when really using it
		get("/api/images/:id", new GetImageHandler(model));

		// a little api for retreiving the websocket addr
		get("/api/wsaddr", (req, res) -> {
			// in production the ws port is default (proxies handle the switchover)
			// in development, the react-script components do not proxy websockets
			//   so we have to go against the java server port directly
			String portString = (wsDevMode) ? ":" + servicePort : "";
			String wsScheme = (Boolean.valueOf(req.queryParams("ssl")) ? "wss://" : "ws://");
			return "{\"address\":\"" + wsScheme + req.queryParams("host") + portString + "/ws\"}";
		});

		// the last thing is the anything -> 404 override, return the index page
		// instead
		get("/*", (req, res) -> {
			// if it's a /ws request, throw a NotConsumedException
			if (isOtherHandler(req.pathInfo())) {
				// let someone else do this
				throw new NotConsumedException();
			}
			// return the index.html as a default
			throw new NotFoundException();
		});

		exception(NotConsumedException.class, (e, req, res) -> {
			// keep going?
			logger.debug("Not consumed, try other things: " + req.pathInfo());
		});

		exception(NotFoundException.class, (e, req, res) -> {
			try {
				// dev mode on heroku, require "special" auth for anything that returns index.html
				if (!basicAuth.isEmpty()) {
					if (!checkBasicAuth(req, res, basicAuth))
						return;
				}

				logger.info("returning default index.html for " + req.pathInfo());
				res.status(200);
				InputStream is = Main.class.getResourceAsStream("/public/index.html");
				res.body(new String(IOUtils.toByteArray(is), "UTF-8"));
			} catch (Exception e2) {
				logger.error(e2.getMessage());
			}
		});

		exception(Exception.class, (exception, request, response) -> {
			// Handle the exception here
			logger.error("Exception handling route: " + request.url());
			logger.error(exception.toString());
		});
	}
}