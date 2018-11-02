CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (  
	   item_id INTEGER(11) AUTO_INCREMENT  NOT NULL,
       product_name VARCHAR(30),
       department_name VARCHAR(30),
       price FLOAT(10,2),
       stock_quantity INTEGER(10),
       PRIMARY KEY(item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("ram 1028 MB","memories",1024,5);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("ram 2056 MB","memories",1515,3);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("ram 4112 MB","memories",2300,3);


