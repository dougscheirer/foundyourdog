\connect foundyourdog_$ENV$

insert into users (email, handle, password_hash, confirmation_token, confirmed, signup_date, confirm_date, phone1, inapp_notifications) values
				  ('doug@dscheirer.com', 'doug', '12345678', '12345678', true, '09/26/2016', '09/26/2016', '925.228.4321', true);
insert into users (email, handle, password_hash, confirmation_token, confirmed, signup_date, confirm_date, phone1, inapp_notifications) values
				  ('doug+2@dscheirer.com', 'doug2', '12345678', '12345678', true, '09/27/2016', '09/27/2016', '925.228.4322', true);
insert into users (email, handle, password_hash, confirmation_token, confirmed, signup_date, confirm_date, phone1, inapp_notifications) values
				  ('doug+3@dscheirer.com', 'doug3', '12345678', '12345678', true, '09/28/2016', '09/28/2016', '925.228.4323', true);
insert into users (email, handle, password_hash, confirmation_token, confirmed, signup_date, confirm_date, phone1, inapp_notifications) values
				  ('doug+4@dscheirer.com', 'doug4', '12345678', '12345678', true, '09/29/2016', '09/29/2016', '925.228.4324', true);
insert into users (email, handle, password_hash, confirmation_token, confirmed, signup_date, confirm_date, phone1, inapp_notifications) values
				  ('doug+5@dscheirer.com', 'doug5', '12345678', '12345678', true, '09/30/2016', '09/30/2016', '925.228.4325', true);

insert into incidents (map_latitude, map_longitude, dog_id, incident_date, state, resolution) values
				      (37.9688918, -122.1025406, 1, '09/26/2016', 'lost', 'none'); 
insert into incidents (map_latitude, map_longitude, dog_id, incident_date, state, resolution) values
				      (37.9698918, -122.1025506, 1, '09/27/2016', 'found', 'none'); 
insert into incidents (map_latitude, map_longitude, dog_id, incident_date, state, resolution) values
				      (37.9708918, -122.1025606, 1, '09/28/2016', 'lost', 'none'); 
insert into incidents (map_latitude, map_longitude, dog_id, incident_date, state, resolution) values
				      (37.9718918, -122.1025706, 1, '09/29/2016', 'found', 'none'); 
insert into incidents (map_latitude, map_longitude, dog_id, incident_date, state, resolution) values
				      (37.9728918, -122.1025806, 1, '09/30/2016', 'lost', 'none'); 

insert into dogs (basic_type, color, gender, intact, owner_id, tags, name, added_date) values
				 ('labrador', 'brown', 'f', 'unknown', 0, null, null, '09/26/2016');
insert into dogs (basic_type, color, gender, intact, owner_id, tags, name, added_date) values
				 ('aussie', 'black', 'f', 'unknown', 0, null, null, '09/27/2016');
insert into dogs (basic_type, color, gender, intact, owner_id, tags, name, added_date) values
				 ('golden retriever', 'light orange', 'm', 'yes', 0, null, null, '09/28/2016');
insert into dogs (basic_type, color, gender, intact, owner_id, tags, name, added_date) values
				 ('labrador', 'black', 'f', 'unknown', 0, null, null, '09/29/2016');
insert into dogs (basic_type, color, gender, intact, owner_id, tags, name, added_date) values
				 ('great dane', 'brindle, white and black', 'm', 'no', 0, null, null, '09/30/2016');

insert into images (user_id, image_location, upload_date, tags, dog_id) values
				 (1, 'http://foundyourdog.com/images/1', '09/26/2016', null, 1);
insert into images (user_id, image_location, upload_date, tags, dog_id) values
				 (2, 'http://foundyourdog.com/images/2', '09/27/2016', null, 2);
insert into images (user_id, image_location, upload_date, tags, dog_id) values
				 (3, 'http://foundyourdog.com/images/3', '09/28/2016', null, 3);
insert into images (user_id, image_location, upload_date, tags, dog_id) values
				 (4, 'http://foundyourdog.com/images/4', '09/29/2016', null, 4);
insert into images (user_id, image_location, upload_date, tags, dog_id) values
				 (5, 'http://foundyourdog.com/images/5', '09/30/2016', null, 5);

