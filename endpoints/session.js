"use strict"

var encryption = require('../encryption'),
    db = require('../db'),
    formidable = require('formidable');

// An endpoint for logging in and out users
class Session {

  // Renders a login form with no error message
  new(req, res) {
    res.render('session/new', {message: "", user: req.user});
  }

  newUser(req, res) {
    res.render('session/newUser', {message: "", user: req.user});
  }

  newUserCreate(req, res, next) {
    var form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
      if(err) return res.sendStatus(500);
      //if else check password and username, is exist send message
      db.get("SELECT * FROM users WHERE username = ?", fields.username, (err, user) => {
        if(user) {
          return res.render('session/newUser', {message: "Username/Password invalid.  Please try again.", user: req.user});
        }
        if(fields.password != fields.repassword) {
          return res.render('session/newUser', {message: "Username/Password invalid.  Please try again.", user: req.user});
        }
        db.run('INSERT INTO users (username, admin, password_digest, adminText) values (?,?,?,?)',
          fields.username,
          false,
          encryption.digest(fields.password),
          "no"
        );
        return res.render('session/new', {message: "New user successfully created, please login.", user: req.user});
      });

    });
  }
  // Creates a new session, provided the username and password match one in the database,
  // If not, renders the login form with an error message.
  create(req, res, next) {
    req.session.reset();
    var form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
      if(err) return res.sendStatus(500);
      db.get("SELECT * FROM users WHERE username = ?", fields.username, (err, user) => {
        if(err) return res.render('session/new', {message: "Username/Password not found.  Please try again.", user: req.user});
        if(!user) return res.render('session/new', {message: "Username/Password not found.  Please try again.", user: req.user});
        if(user.password_digest != encryption.digest(fields.password)) return res.render('session/new', {message: "Username/Password not found.  Please try again.", user: req.user});
        req.session.user_id = user.id;
        return res.redirect('/wiki');
      });
    });
  }

  ban(req, res) {
    db.get("SELECT * FROM users WHERE username = ?", req.params.username, (err, userS) => {
      if(req.params.username != "admin" && req.params.username != req.user.username && !userS.admin) {
        db.run('DELETE FROM users WHERE username=?', req.params.username);
        var userL = db.all('SELECT * FROM users', function(err, userL){
          if(err) {
            console.error(err);
            return res.sendStatus(500);
          }
          res.render('equipment/userList', {message: "User successfully banned.", userI: userL, user: req.user});
          //res.redirect('/userlist');
        });
      }
      else {
        var userL = db.all('SELECT * FROM users', function(err, userL){
          if(err) {
            console.error(err);
            return res.sendStatus(500);
          }
          res.render('equipment/userList', {message: "Unable to ban main admin, other admins or self", userI: userL, user: req.user});
        });
      }
    });
  }

  grant(req, res){
    if(req.user.username == "admin" && req.params.username != "admin"){
      db.run('UPDATE users SET admin = ?, adminText = ? WHERE username=?',
        true,
        "yes",
        req.params.username
      );
      var userL = db.all('SELECT * FROM users', function(err, userL){
        if(err) {
          console.error(err);
          return res.sendStatus(500);
        }
      return res.render('equipment/userList', {message: "User made into admin.", userI: userL, user: req.user});
      });
    }
    else {
      var userL = db.all('SELECT * FROM users', function(err, userL){
        if(err) {
          console.error(err);
          return res.sendStatus(500);
        }
        res.render('equipment/userList', {message: "Only main admin can grant or remove admin privillege. Main admin privillege cannot be removed.", userI: userL, user: req.user});
      });
    }
  }

  remove(req, res){
    if(req.user.username == "admin" && req.params.username != "admin"){
      db.run('UPDATE users SET admin = ?, adminText = ? WHERE username=?',
        false,
        "no",
        req.params.username
      );
      var userL = db.all('SELECT * FROM users', function(err, userL){
        if(err) {
          console.error(err);
          return res.sendStatus(500);
        }
      return res.render('equipment/userList', {message: "Removed admin privillege.", userI: userL, user: req.user});
      });
    }
    else {
      var userL = db.all('SELECT * FROM users', function(err, userL){
        if(err) {
          console.error(err);
          return res.sendStatus(500);
        }
        res.render('equipment/userList', {message: "Only main admin can grant or remove admin privillege. Main admin privillege cannot be removed.", userI: userL, user: req.user});
      });
    }
  }

  // Ends a user session by flushing the session cookie.
  destroy(req, res) {
    req.session.reset();
    res.render("session/delete", {user: {username: "Guest"}});
  }

}

module.exports = exports = new Session();
