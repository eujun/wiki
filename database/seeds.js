var db = require('../db'),
    encryption = require('../encryption');

// Create the database schema and populate
db.serialize(function() {

  // Drop users table if it exists
  db.run("DROP TABLE IF EXISTS users");
  // Create the users table
  db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT UNIQUE, admin BOOLEAN, password_digest TEXT, salt TEXT, adminText TEXT)");
  // Create a default user
  var salt = encryption.salt();
  db.run("INSERT INTO users (username, admin, password_digest, salt, adminText) values (?,?,?,?,?)",
    'admin',
    true,
    encryption.digest('admin'),
    salt,
    "yes"
  );
  db.run("INSERT INTO users (username, admin, password_digest, salt, adminText) values (?,?,?,?,?)",
    'bobby',
    true,
    encryption.digest('bobby'),
    salt,
    "yes"
  );
  db.run("INSERT INTO users (username, admin, password_digest, salt, adminText) values (?,?,?,?,?)",
    'chris',
    false,
    encryption.digest('chris'),
    salt,
    "no"
  );
  // Log contents of the user table to the console
  db.each("SELECT * FROM users", function(err, row){
    if(err) return console.error(err);
    console.log(row);
  });


  // Drop equipment table if it exists
  db.run("DROP TABLE IF EXISTS equipment");
  // Create the equipment table
  db.run("CREATE TABLE equipment (id INTEGER PRIMARY KEY, name VARCHAR(50), description TEXT, discussion TEXT )");
  // Populate the equipment table
  /*for(var i = 0; i < 20; i++) {
    db.run("INSERT INTO equipment (name, property_number) VALUES ('WiiMote', 'CIS-WII-" + i + "')");
  }*/
  // Log contents of equipment table to the console
  db.each("SELECT * FROM equipment", function(err, row){
    if(err) return console.error(err);
    console.log(row);
  });

});
