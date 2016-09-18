package app;

import static spark.Spark.*;
import java.util.logging.Logger;

import org.sql2o.Sql2o;
import org.sql2o.quirks.PostgresQuirks;

import com.beust.jcommander.JCommander;

import app.model.Model;
import app.sql2o.Sql2oModel;
import freemarker.cache.ClassTemplateLoader;
import freemarker.template.Configuration;
import spark.Spark;
import spark.template.freemarker.FreeMarkerEngine;

public class Main {
	final static Logger logger = Logger.getLogger(Main.class.getCanonicalName());

	public static void main(String[] args) {
        CommandLineOptions options = new CommandLineOptions();
        new JCommander(options, args);

        logger.finest("Options.debug = " + options.debug);
        logger.finest("Options.database = " + options.database);
        logger.finest("Options.dbHost = " + options.dbHost);
        logger.finest("Options.dbUsername = " + options.dbUsername);
        logger.finest("Options.dbPort = " + options.dbPort);
        logger.finest("Options.servicePort = " + options.servicePort);

        port(options.servicePort);

        Sql2o sql2o = new Sql2o("jdbc:postgresql://" + options.dbHost + ":" + options.dbPort + "/" + options.database,
                options.dbUsername, options.dbPassword, new PostgresQuirks() {
            {
            }
        });

        Model model = new Sql2oModel(sql2o);
        FreeMarkerEngine freeMarkerEngine = new FreeMarkerEngine();
        Configuration freeMarkerConfiguration = new Configuration();
        freeMarkerConfiguration.setTemplateLoader(new ClassTemplateLoader(Main.class, "/"));
        freeMarkerEngine.setConfiguration(freeMarkerConfiguration);

		Spark.staticFileLocation("/public");

		// add all of the handlers here
		get("/hello", (req, res) -> "hello");
	}
}
