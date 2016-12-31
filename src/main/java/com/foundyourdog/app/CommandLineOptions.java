package com.foundyourdog.app;

import com.beust.jcommander.Parameter;

class CommandLineOptions {

    @Parameter(names = "--debug")
    boolean debug = false;

    @Parameter(names = {"--service-port"})
    Integer servicePort = 4567;

    @Parameter(names = {"--database"})
    String database = "foundyourdog_dev";

    @Parameter(names = {"--db-host"})
    String dbHost = "localhost";

    @Parameter(names = {"--db-username"})
    String dbUsername = "admin";

    @Parameter(names = {"--db-password"})
    String dbPassword = "password";

    @Parameter(names = {"--db-port"})
    Integer dbPort = 5432;

    @Parameter(names = {"--image-location"})
    String imageLocation = "uploads/images";
}
