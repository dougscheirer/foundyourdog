CREATE USER admin WITH PASSWORD '$PASSWD$';
CREATE DATABASE foundyourdog_$ENV$;
\connect foundyourdog_$ENV$

GRANT ALL PRIVILEGES ON DATABASE foundyourdog_$ENV$ TO admin;

CREATE TABLE IF NOT EXISTS users (
    uuid text primary key,
    email text not null unique,
    handle text unique,
    password_hash text not null,
    confirmation_token text not null,
    confirmed bool,
    signup_date date,
    confirm_date date,
    deactivate_date date,
    phone1 text,
    phone2 text,
    inapp_notifications bool
);

CREATE TABLE IF NOT EXISTS incidents (
    uuid text primary key,
    map_latitude float,
    map_longitude float,
    reporter_id text,
    dog_id text,
    incident_date date,
    state text not null,
    resolution text
);

CREATE TABLE IF NOT EXISTS resolutions (
    uuid text primary key,
    incident_id text,
    dog_id text,
    dog_id_owner text,
    resolve_date date,
    resolve_text text
);

CREATE TABLE IF NOT EXISTS dogs (
	uuid text primary key,
	basic_type text,
    color text,
	gender text,
	intact text,
	owner_id text,
	tags text,
	name text,
	added_date date,
    image_id text
);

CREATE TABLE IF NOT EXISTS images (
	uuid text primary key,
	user_id text not null,
	image_location text,
	upload_date date,
	tags text,
	dog_id text
);

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO admin;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public to admin;