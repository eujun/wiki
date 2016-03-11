# install cilent-sessions
npm install cilent-sessions --save
# install ejs
npm install ejs --save
# install express
npm install express --save
# install formidable
npm install formidable --save
# install passport
npm install passport --save
# install passport-local
npm install passport-local --save
# install sqlite3
npm install sqlite3 --save

#run app.js to start server on localhost
node app.js

Database already contains a few wiki pages and users admin, bobby, chris, with passwords mirroring each own usernames.
#add wiki page
Link to add wiki is provided in main page where authenticated users can input title and content. Only admins can delete wiki pages. Created wiki page will have a talk page where users can add discussions.
#login
Users can login with matching username and password or create new accounts
#admin privillege
Only Main Admin can grant or remove admin privillege to users. Assigned Admin (AA) can ban regular users but not other admins. To ban an AA, Main Admin have to remove admin prillege of said user then only a ban is possible.
