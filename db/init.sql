CREATE USER admin WITH PASSWORD '$PASSWD$';
CREATE DATABASE foundyourdog_$ENV$;
\connect foundyourdog_$ENV$

GRANT ALL PRIVILEGES ON DATABASE foundyourdog_$ENV$ TO admin;

CREATE TABLE IF NOT EXISTS users (
    id SERIAL primary key,
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
    id SERIAL primary key,
    map_latitude float,
    map_longitude float,
    dog_id integer,
    incident_date date,
    state text not null,
    resolution text
);

CREATE TABLE IF NOT EXISTS dogs (
	id SERIAL primary key,
	basic_type text,
    color text,
	gender text,
	intact text,
	owner_id integer,
	tags text,
	name text,
	added_date date
);

CREATE TABLE IF NOT EXISTS images (
	id SERIAL primary key,
	user_id integer not null,
	image_location text,
	upload_date date,
	tags text,
	dog_id integer not null
);

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO admin;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public to admin;