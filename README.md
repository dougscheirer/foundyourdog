# foundyourdog

Java spark app for running foundyourdog.org

# dev

db/start.sh   										: start the postgres server (pa55word)
heroku local -f Procfile.local  	: start from the Procfile (liek heroku does)
nodejs/npm start									: start the frontend assuming the backend will be proxied at 4567
(eclipse debug)										: start the java backend on 4567

Handy configurables (.env):
	PORT
		port to run the java backend on
	HOST
		hostname for the upload URL generation
	DATABASE_URL='postgres://postgres:pa55word@localhost:5432/foundyourdog_dev'
		URL for postgres
	BASIC_AUTH='admin:pizza'
		require basic auth on loading /index.html with this user/password combo
	WS_DEV_MODE=true
		provide the actual port that the java app is running on for web socket connections
		in production environments or heroku, this may not be the publicly exposed port if proxying is used
	SENDGRID_API_KEY
		API key for emailing through sendgrid (default is to use SMTP to localhost:1025, i.e. mailcatcher)
	CLOUDINARY_URL
		For production or heroku, the Cloudinary info for image management.  Default is local storage in uploads/images
	ASSUME_HTTPS
		For link generation, ignore the actual scheme used and assume it should be HTTPS (e.g. proxying on heroku)
	ADMIN_EMAIL
		For email from addressing, the system email (default is fydo-admin@foundyourdog.com)
