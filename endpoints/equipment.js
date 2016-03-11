"use strict"

var db = require('../db'),
    formidable = require('formidable');

// A controller for the equipment resource
// This should have methods for all the RESTful actions
class Equipment {

  index(req, res) {
    var equipment = db.all('SELECT * FROM equipment', function(err, equipment){
      if(err) {
        console.error(err);
        return res.sendStatus(500);
      }
      res.render('equipment/index', {equipment: equipment, user: req.user});
    });
  }

  show(req, res) {
    var equipment = db.get('SELECT * FROM equipment WHERE ID=?', req.params.id, function(err, item){
      if(err) {
        console.error(err);
        return res.sendStatus(400);
      }
      res.render('equipment/show', {equipment: item, user: req.user});
    });
  }

  new(req, res) {
    res.render('equipment/new', {user: req.user});
  }

  talk(req,res) {
    var equipment = db.get('SELECT * FROM equipment WHERE ID=?', req.params.id, function(err, item){
      if(err) {
        console.error(err);
        return res.sendStatus(400);
      }
      res.render('equipment/talk', {equipment: item, user: req.user});
    });
  }

  talkCreate(req,res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
      db.run('UPDATE equipment SET discussion=(discussion||char(10)||?) WHERE id=?',
        req.user.username + ": " + fields.discussion,
        req.params.id
      );
      res.redirect('/wiki/'+req.params.id+'/talk');
    });
  }

  create(req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
      db.run('INSERT INTO equipment (name, description,discussion) values (?,?,"")',
        fields.name,
        fields.description,
        fields.discussion
      );
      res.redirect('/wiki');
    });
  }

  edit(req, res) {
    var equipment = db.get('SELECT * FROM equipment WHERE ID=?', req.params.id, function(err, item){
      if(err) {
        console.error(err);
        return res.sendStatus(400);
      }
      res.render('equipment/edit', {equipment: item, user: req.user});
    });
  }

  editCreate(req,res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
      db.run('UPDATE equipment SET name = ?, description = ? WHERE id=?',
        fields.name,
        fields.description,
        req.params.id
      );
      res.redirect('/wiki/'+req.params.id);
    });
  }

  destroy(req, res) {
    db.run('DELETE FROM equipment WHERE id=?', req.params.id);
    res.redirect('/wiki');
  }

  userList(req, res) {
    var userL = db.all('SELECT * FROM users', function(err, userL){
      if(err) {
        console.error(err);
        return res.sendStatus(500);
      }
      res.render('equipment/userList', {message: "", userI: userL, user: req.user});
    });
  }

  redirect(req, res) {
    res.writeHead(301, {"Content-Type":"text/html", "Location":"/equipment"});
    res.end("This page has moved to <a href='/equipment'>equipment</a>");
  }

  autocomplete(req, res) {
    db.all('SELECT DISTINCT name FROM equipment WHERE name LIKE ?', req.params.token + '%', function(err, data){
      if(err) {
        console.error(err);
        res.writeHead(400, {"Content-Type":"text/json"});
        res.end("[]");
        return;
      }
      res.writeHead(200, {"Content-Type":"text/json"});
      res.end(JSON.stringify( data.map( function(pair) {return pair.name}) ));
    });
  }
}

module.exports = exports = new Equipment();
