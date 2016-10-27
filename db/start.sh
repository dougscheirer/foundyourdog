#!/bin/bash
docker run --name postgres_fydo -p 5432:5432 -e POSTGRES_PASSWORD=pa55word -d postgres
