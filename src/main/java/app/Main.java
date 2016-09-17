package app;

import static spark.Spark.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Main {
	final static Logger logger = LoggerFactory.getLogger(Main.class);

	public static void main(String[] args) {
		get("/hello", (req, res) -> "hello");
	}
}
