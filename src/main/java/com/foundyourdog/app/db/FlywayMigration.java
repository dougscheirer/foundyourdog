package com.foundyourdog.app.db;

import java.util.List;
import java.util.ArrayList;

import org.flywaydb.core.Flyway;

public class FlywayMigration {
    public static void main(String[] args) throws Exception {
      Flyway flyway = new Flyway();
      
      flyway.setDataSource(DBConnection.getUrl(), DBConnection.getUser(), DBConnection.getPassword());
      String[] defaultActions = new String[] { "migrate" };
      String[] actions = (args.length == 0) ? defaultActions : args;
      for (String action : actions) {
	      switch (action) {
	        case "clean":
	          flyway.clean();
	          break;
	        case "migrate":
	          flyway.migrate();
	          break;
	        case "repair":
	          flyway.repair();
	          break;
	        default:
	          System.out.println("SKIP: No flyway action for " + action);
	          break;
	      }
      }
    }
}