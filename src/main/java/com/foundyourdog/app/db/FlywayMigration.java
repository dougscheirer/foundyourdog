package com.foundyourdog.app.db;

import org.flywaydb.core.Flyway;

public class FlywayMigration {
    public static void main(String[] args) throws Exception {
      Flyway flyway = new Flyway();
      
      flyway.setDataSource(DBConnection.getUrl(), DBConnection.getUser(), DBConnection.getPassword());
      String action = (args.length == 0) ? "migrate" : "clean";
      switch (action) {
        case "clean":
          flyway.clean();
          break;
        case "migrate":
          flyway.migrate();
          break;
        default:
          System.out.println("No flyway action");
      }
    }
}