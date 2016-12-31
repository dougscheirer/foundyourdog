#!/bin/bash
source .env
DATABASE_URL=$DATABASE_URL java -cp target/foundyourdog-app.jar:target/dependency/* com.foundyourdog.app.db.FlywayMigration clean
