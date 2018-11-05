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
var databaseParse = {
  productNames:[],
  itemsIDs:[],
  department_names:[],
  prices:[],
  stock_quantities:[]
};
var productToBuy="";
var productIndex=null;
var productQuantity=0;
var quantityToBuy=0;

function resParse(res){
  for (var i=0;i<res.length;i++){
      databaseParse.itemsIDs.push(res[i].item_id);
      databaseParse.productNames.push(res[i].product_name);
      databaseParse.department_names.push(res[i].department_name);
      databaseParse.prices.push(res[i].price);
      databaseParse.stock_quantities.push(res[i].stock_quantity);
  }
 // console.log(res);
  //console.log("ids",databaseParse.itemsIDs);
  //console.log("products",databaseParse.productNames);
}
function buy(){

  var restante=productQuantity-quantityToBuy;
  var sql="UPDATE products SET stock_quantity="+restante+" WHERE item_id="+productIndex;
  connection.query(sql, function(err, res) {
       if (err) throw err;
       if (res.affectedRows==1){
        console.log("Purchase completed");
       }
       else{
         console.log("Something go wrong, purchase not possible.");
    
       }
       connection.end();
   
    });
}

function howMany()
{
  var mssg="How many "+productToBuy+" do you want to buy ? ("+productQuantity+" available) :";
  inquirer.prompt(
    {
      type: "input",
      name: "qty",
      message: mssg
    }
  ).then(function(action){
      if(action.qty<=productQuantity){
        quantityToBuy=action.qty;
        buy();
      }
      else{
        console.log("Not enough products available. ");
      }
  });

}


function quantityProduct(){
  connection.query("SELECT stock_quantity FROM products WHERE item_id=?",(productIndex), function(err, res) {
    //  connection.end();
      if (err) throw err;
  //    console.log(res);
      productQuantity=res[0].stock_quantity;
//      console.log("Quantity available :",productQuantity);
      howMany();
    });

}

function indexProduct(product){
  connection.query("SELECT item_id FROM products WHERE product_name=?",(product), function(err, res) {
  //  connection.end();
    if (err) throw err;
    //console.log(res);
    productIndex=res[0].item_id;
    //console.log(productIndex);
    quantityProduct();
  });
}


function whatToBuy(products)
{
  inquirer.prompt([
    {
      type: "list",
      name: "product",
      message: "Which product do you want to buy?",
      choices: products
      
    }
  
  ]).then(function(action) {
    // Choose item to buy...
   // console.log("product",action.product);
   // console.log("action",action);
    if (action.product){
      //how many items
      productToBuy=action.product;
      indexProduct(productToBuy);
      
      
    }
    else {
        console.log("Option not available, try 1 to 10");
    }
  });
}  





function afterConnection() {
  connection.query("SELECT * FROM products", function(err, res) {
     if (err) throw err;
    //console.log("ItemID     Product Name                               Quantity Av.   Department Name");
   // console.log(res);
    //console.table(["1","3","33"]);
   resParse(res);
   whatToBuy(databaseParse.productNames);
   
   
   
   
  });
}


