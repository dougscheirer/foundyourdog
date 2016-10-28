#!/bin/bash
FYDO_DB=$(docker ps -qf name=postgres_fydo)
if [ "$FYDO_DB" != "" ]; then
	echo "already running: $FYDO_DB" && exit 0
fi

FYDO_DB=$(docker ps -aqf name=postgres_fydo)

if [ "$FYDO_DB" != "" ]; then
	docker run --name postgres_fydo -p 5432:5432 -e POSTGRES_PASSWORD=pa55word -d postgres
else
	docker start postgres_fydo
fi
