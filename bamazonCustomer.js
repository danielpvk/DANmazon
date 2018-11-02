var mysql = require("mysql");
//var genre = process.argv[2]+" "+process.argv[3];
//console.log(genre);

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazon_db"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  afterConnection();
});

var example="memories";

function afterConnection() {
  connection.query("SELECT * FROM products WHERE department_name=?",(example), function(err, res) {
    if (err) throw err;
    console.log(res);
    connection.end();
  });
}
