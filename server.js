var express = require("express");
var exphbs = require("express-handlebars");
var mysql = require("mysql");

var app = express();

// Set the port of our application
// process.env.PORT lets the port be set by Heroku
var PORT = process.env.PORT || 8080;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "burger"
});

connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }

  console.log("connected as id " + connection.threadId);
});

app.get("/", function(req, res) {
  connection.query("SELECT * FROM burgerItems;", function(err, data) {
    if (err) throw err;

    console.log(data);

    res.render("index", { burgerItems: data });
  });
});

app.post("/", function(req, res) {
  connection.query(
    "INSERT INTO burgerItems (name) VALUES (?)",
    [req.body.name],
    function(err, result) {
      if (err) throw err;

      res.redirect("/");
    }
  );
});

app.put("/:id", function(req, res) {
  let thisId = req.params.id;

  console.log( 'put query', `UPDATE burgerItems SET devoured = 1 WHERE idburger = ${thisId}`)

  console.log( 'req params', req.params)

  connection.query(
    `UPDATE burgerItems SET devoured = 1 WHERE idburger = ${thisId}`,
    function(err, result) {
      if (err) throw err;

      res.send(200);
      //res.redirect("/");
    }
  );
});

// Start our server so that it can begin listening to client requests.
app.listen(PORT, function() {
  // Log (server-side) when our server has started
  console.log("Server listening on: http://localhost:" + PORT);
});
