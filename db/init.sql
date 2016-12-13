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
    password_reset_token text,
    password_reset_time timestamptz,
    confirmed bool default false,
    signup_date timestamptz,
    confirm_date timestamptz,
    deactivate_date timestamptz,
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
    incident_date timestamptz,
    state text not null,
    resolution_id text default null
);

CREATE TABLE IF NOT EXISTS resolutions (
    uuid text primary key,
    incident_id text,
    dog_id text,
    dog_id_owner text,
    resolve_date timestamptz,
    resolve_text text
);

CREATE TABLE IF NOT EXISTS dogs (
	uuid text primary key,
	primary_type text,
    secondary_type text,
    primary_color text,
    secondary_color text,
    coat_type text,
	gender text,
	intact text,
	owner_id text,
	tags text,
	name text,
	added_date timestamptz,
    image_id text
);

CREATE TABLE IF NOT EXISTS images (
	uuid text primary key,
	user_id text not null,
	image_location text,
	upload_date timestamptz,
	tags text,
	dog_id text,
    status text
);

CREATE TABLE IF NOT EXISTS messages (
    uuid text primary key,
    ordinal SERIAL,
    incident_id text not null,
    receiver_id text not null,
    sent_date timestamptz not null,
    sender_id text not null,
    receiver_read boolean default false,
    receiver_delete boolean default false,
    message text not null,
    receiver_flagged bool default false,
    responding_to text
);

CREATE INDEX messages_incident ON messages (incident_id);
CREATE INDEX messages_receiver ON messages (receiver_id);
CREATE INDEX messages_sender   ON messages (sender_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO admin;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public to admin;