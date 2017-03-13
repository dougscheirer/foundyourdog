# foundyourdog

Java spark app for running foundyourdog.org

# dev

* db/start.sh : start the postgres server (pa55word)
* heroku local -f Procfile.local : start from the Procfile (like heroku does)
* nodejs/npm start : start the frontend assuming the backend will be proxied at 4567
* (eclipse debug) : start the java backend on 4567

Handy configurables (.env):

* PORT - port to run the java backend on
* HOST - hostname for the upload URL generation
* DATABASE\_URL - e.g. DATABASE\_URL='postgres://postgres:pa55word@localhost:5432/foundyourdog_dev', the postgres DB URL
* BASIC\_AUTH - e.g. BASIC_AUTH='admin:pizza', requires basic auth on loading /index.html with this user/password combo
* WS\_DEV\_MODE - e.g. WS\_DEV\_MODE=true, provide the actual port that the java app is running on for web socket connections.  In production environments or heroku, this may not be the publicly exposed port if proxying is used
* SENDGRID\_API\_KEY - API key for emailing through sendgrid (default is to use SMTP to localhost:1025, i.e. mailcatcher)
* CLOUDINARY\_URL - For production or heroku, the Cloudinary info for image management.  Default is local storage in uploads/images
* ASSUME\_HTTPS - For link generation, ignore the actual scheme used and assume it should be HTTPS (e.g. proxying on heroku)
* ADMIN\_EMAIL - For email from addressing, the system email (default is fydo-admin@foundyourdog.com)
