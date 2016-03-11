var express = require('express'),
    app = express(),
    sessions = require('client-sessions'),
    loadUser = require('./middleware/load_user'),
    noGuests = require('./middleware/no_guests'),
    adminOnly = require('./middleware/admin_only'),
    encryption = require('./encryption');

// Enable template engine
app.set('view engine', 'ejs');
app.set('views', './templates');

// Enable sessions
app.use(sessions({
  cookieName: 'session',
  secret: 'somerandomstring',
  duration: 24*60*60*1000,
  activeDuration: 1000*60*5
}));

// Load the user (if there is one)
app.use(loadUser);

// Serve static files
app.use(express.static('public'));

// Login routes
var session = require('./endpoints/session');
app.get('/login', session.new);
app.post('/login', session.create);
app.get('/logout', session.destroy);
app.get('/user/new', session.newUser);
app.post('/user/new', session.newUserCreate);
app.get('/userlist/:username/ban', session.ban);
app.get('/userlist/:username/grant', session.grant);
app.get('/userlist/:username/remove', session.remove);

// Equipment routes
var equipment = require('./endpoints/equipment');
app.get('', equipment.index);
app.get('/wiki', equipment.index);
app.get('/wiki/new', noGuests, equipment.new);
app.get('/wiki/:id', equipment.show);
app.get('/wiki/:id/talk', equipment.talk);
app.post('/wiki/:id/talk', noGuests, equipment.talkCreate);
app.get('/wiki/:id/edit', noGuests, equipment.edit);
app.post('/wiki/:id', equipment.editCreate);
app.post('/wiki', equipment.create);
app.get('/wiki/:id/delete', adminOnly, equipment.destroy);
app.get('/userlist', adminOnly, equipment.userList);

// Reservation routes
var reservation = require('./endpoints/reservation');
app.get('/reservation/new', noGuests, reservation.new);

app.listen(80, () => {
  console.log("Listening on port 80...");
});
