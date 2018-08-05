CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE IF NOT EXISTS `bamazon`.`products` (
  `item_id` INT NOT NULL AUTO_INCREMENT,
  `product_name` VARCHAR(100) NOT NULL,
  `department_name` VARCHAR(100) NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `stock_quantity` INT NOT NULL,
  PRIMARY KEY (`item_id`));

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Laptop", "Electronics", 1500.00, 15);
INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Smartphone", "Electronics", 850.00, 35);
INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Football", "Sports", 14.99, 40);
INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Game of Thrones Bluray", "Entertainment", 50.00, 12);
INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Headphones", "Electronics", 150.00, 24);
INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Harry Potter Book Collection", "Books", 70.00, 25);
INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Smart TV", "Electronics", 550.00, 17);
INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("CD", "Music", 13.99, 32);
INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Kindle", "Electronics", 90.00, 18);
INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Shirt", "Clothing", 19.99, 17);