\connect foundyourdog_$ENV$

insert into users (uuid, email, handle, password_hash, confirmation_token, confirmed, signup_date, confirm_date, phone1, inapp_notifications) values
				  ('1', 'doug@dscheirer.com', 'doug', '12345678', '12345678', true, '09/26/2016', '09/26/2016', '925.228.4321', true);
insert into users (uuid, email, handle, password_hash, confirmation_token, confirmed, signup_date, confirm_date, phone1, inapp_notifications) values
				  ('2', 'doug+2@dscheirer.com', 'doug2', '12345678', '12345678', true, '09/27/2016', '09/27/2016', '925.228.4322', true);
insert into users (uuid, email, handle, password_hash, confirmation_token, confirmed, signup_date, confirm_date, phone1, inapp_notifications) values
				  ('3', 'doug+3@dscheirer.com', 'doug3', '12345678', '12345678', true, '09/28/2016', '09/28/2016', '925.228.4323', true);
insert into users (uuid, email, handle, password_hash, confirmation_token, confirmed, signup_date, confirm_date, phone1, inapp_notifications) values
				  ('4', 'doug+4@dscheirer.com', 'doug4', '12345678', '12345678', true, '09/29/2016', '09/29/2016', '925.228.4324', true);
insert into users (uuid, email, handle, password_hash, confirmation_token, confirmed, signup_date, confirm_date, phone1, inapp_notifications) values
				  ('5', 'doug+5@dscheirer.com', 'doug5', '12345678', '12345678', true, '09/30/2016', '09/30/2016', '925.228.4325', true);

insert into incidents (uuid, map_latitude, map_longitude, dog_id, incident_date, state, resolution) values
				      ('1', 37.9688918, -122.1025406, '1', '09/26/2016', 'lost', 0);
insert into incidents (uuid, map_latitude, map_longitude, dog_id, incident_date, state, resolution) values
				      ('2', 37.9698918, -122.1025506, '2', '09/27/2016', 'found', 0);
insert into incidents (uuid, map_latitude, map_longitude, dog_id, incident_date, state, resolution) values
				      ('3', 37.9708918, -122.1025606, '3', '09/28/2016', 'lost', 0);
insert into incidents (uuid, map_latitude, map_longitude, dog_id, incident_date, state, resolution) values
				      ('4', 37.9718918, -122.1025706, '4', '09/29/2016', 'found', 0);
insert into incidents (uuid, map_latitude, map_longitude, dog_id, incident_date, state, resolution) values
				      ('5', 37.9728918, -122.1025806, '5', '09/30/2016', 'lost', 0);

insert into dogs (uuid, basic_type, color, gender, intact, owner_id, tags, name, added_date) values
				 ('1', 'labrador', 'brown', 'f', 'unknown', null, null, null, '09/26/2016');
insert into dogs (uuid, basic_type, color, gender, intact, owner_id, tags, name, added_date) values
				 ('2', 'aussie', 'black', 'f', 'unknown', null, null, null, '09/27/2016');
insert into dogs (uuid, basic_type, color, gender, intact, owner_id, tags, name, added_date) values
				 ('3', 'golden retriever', 'light orange', 'm', 'yes', '1', null, null, '09/28/2016');
insert into dogs (uuid, basic_type, color, gender, intact, owner_id, tags, name, added_date) values
				 ('4', 'labrador', 'black', 'f', 'unknown', null, null, null, '09/29/2016');
insert into dogs (uuid, basic_type, color, gender, intact, owner_id, tags, name, added_date) values
				 ('5', 'great dane', 'brindle, white and black', 'm', 'no', '3', null, null, '09/30/2016');

insert into images (uuid, user_id, image_location, upload_date, tags, dog_id) values
				 ('1', '1', 'http://foundyourdog.com/images/1', '09/26/2016', null, '1');
insert into images (uuid, user_id, image_location, upload_date, tags, dog_id) values
				 ('2', '2', 'http://foundyourdog.com/images/2', '09/27/2016', null, '2');
insert into images (uuid, user_id, image_location, upload_date, tags, dog_id) values
				 ('3', '3', 'http://foundyourdog.com/images/3', '09/28/2016', null, '3');
insert into images (uuid, user_id, image_location, upload_date, tags, dog_id) values
				 ('4', '4', 'http://foundyourdog.com/images/4', '09/29/2016', null, '4');
insert into images (uuid, user_id, image_location, upload_date, tags, dog_id) values
				 ('5', '5', 'http://foundyourdog.com/images/5', '09/30/2016', null, '5');

