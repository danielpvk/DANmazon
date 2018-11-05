var mysql = require("mysql");
var inquirer = require("inquirer");
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

var continuar=true;

function updateInventory(index,qty){
  var mssg1="SELECT stock_quantity FROM products WHERE item_id="+index;
  connection.query(mssg1,function(err1,res1){
    if (err1) throw err1;
    qty=parseInt(qty)+parseInt(res1[0].stock_quantity);
          var mssg="UPDATE products SET stock_quantity="+qty+" WHERE item_id="+index;
          connection.query(mssg, function(err, res) {
            if (err) throw err;
            if (res.affectedRows==1){
            console.log("Inventory updated");
            }
            else{
              console.log("Something go wrong, purchase not possible.");
        
            }
            connection.end();

        });  
  });
}

function gatherQuantity(index){
  inquirer.prompt(
    {
      type: "input",
      name: "qty",
      message:"How many products do you want to add :"
    }
  ).then(function(action){
       quantityToAdd=action.qty;
       updateInventory(index,quantityToAdd);

  });
}


function addInventory(products)
{
  inquirer.prompt(
    {
      type: "input",
      name: "indx",
      message:"Type one item id to add inventory ("+ products+") :"
    }
  ).then(function(action){
        var indexToModify=action.indx;
        gatherQuantity(indexToModify);
      
  });
}



function all(option) {
  connection.query("SELECT * FROM products", function(err, res) {

      if (err) throw err;
      //console.log(res);
      for (var i=0; i<res.length;i++){
          console.log("ID",res[i].item_id," Product: ",res[i].product_name," Quantity: ",res[i].stock_quantity," Price",res[i].price);
      }
      if (option==1){
        connection.end();
      }
      else
         {  var indexes=[];
            for (var i=0;i<res.length;i++)
            {
              indexes.push(res[i].item_id);
            }
            addInventory(indexes);
         }
    });
}

function lowInventory() {
  connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, res) {

      if (err) throw err;
      console.log("***low inventory");
      for (var i=0; i<res.length;i++){
          console.log("ID",res[i].item_id," Product: ",res[i].product_name," Quantity: ",res[i].stock_quantity," Price",res[i].price);
      }
      connection.end();
    });
}

function manage()
{
  inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "What do you want to do?",
      choices: ["1) View all products","2) View products with less than 5 products","3) Add inventory to a product","4) Add product"]
      
    }
  
  ]).then(function(action) {
    switch (action.action){
      case ("1) View all products"):all(1);break;
      case ("2) View products with less than 5 products"):lowInventory();break;
      case ("3) Add inventory to a product"):all(2);break;

    }



  });
}  

function afterConnection(){
   
      manage();
    
   
}


