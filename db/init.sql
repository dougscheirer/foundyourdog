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
    confirmed bool default false,
    signup_date timestamp,
    confirm_date timestamp,
    deactivate_date timestamp,
    phone1 text,
    phone2 text,
    inapp_notifications bool default true,
    admin bool default false
);

CREATE TABLE IF NOT EXISTS incidents (
    uuid text primary key,
    map_latitude float,
    map_longitude float,
    reporter_id text not null,
    dog_id text,
    incident_date timestamp,
    state text not null,
    resolution_id text default null
);

CREATE TABLE IF NOT EXISTS resolutions (
    uuid text primary key,
    incident_id text,
    dog_id text,
    dog_id_owner text,
    resolve_date timestamp,
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
	added_date timestamp,
    image_id text
);

CREATE TABLE IF NOT EXISTS images (
	uuid text primary key,
	user_id text not null,
	image_location text,
	upload_date timestamp,
	tags text,
	dog_id text,
    status text
);

CREATE TABLE IF NOT EXISTS notifications (
    uuid text primary key,
    incident_id text not null,
    receiver_id text not null,
    sent_date timestamp not null,
    sender_id text not null,
    sender_read boolean default false,
    sender_delete boolean default false,
    messsage text not null,
    sender_flagged bool default false,
    responding_to text
);

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO admin;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public to admin;