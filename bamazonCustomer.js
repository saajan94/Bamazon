// Dependencies
var mysql = require("mysql");
var inquirer = require("inquirer");
var table = require("console.table");
var colors = require("colors");
var productId = 0;
var productQuantity = 0;
var selected;
var statement;

// Creates connection to SQL database
var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) {
        throw err;
    }
    start();
});

// Function to start the applicaiton
function start() {
    console.log("\nWelcome to Bamazon!\n".green);
    inquirer.prompt(
        {
            name: "browse",
            type: "confirm",
            message: "Would you like to browse all of the available products?"
        }
    ).then(function (answer) {
        if (answer.browse) {
            showItems();
            setTimeout(promptUser, 1000);
        } else {
            exit();
        }
    });
}

// Function that allows the use to see all of the available products via a table
function showItems() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) {
            throw err;
        }

        console.log("\nProducts\n".magenta.underline)

        var headings = ["Product ID", "Product", "Department", "Price ($)", "Stock"];
        var products = [];

        for (var i = 0; i < res.length; i++) {
            products.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
        }

        console.table(headings, products);

    })
}

// Function to allow the user to select a product by its ID
function promptUser() {
    inquirer.prompt([
        {
            name: "id",
            type: "input",
            message: "Please enter the ID number of the product you would like to purchase.",
            validate: function (value) {
                if (value <= 0 || isNaN(value)) {
                    console.log("\nPlease enter a valid product ID number.\n".red)
                } else {
                    return true;
                }
            }
        },
        {
            name: "quantity",
            type: "input",
            message: "Please enter the quantity of the product you would like to purchase.",
            validate: function (value) {
                if (value <= 0 || isNaN(value)) {
                    console.log("\nPlease enter a valid quantity.\n".red)
                } else {
                    return true;
                }
            }
        }
    ]).then(function(answer) {
        productId = answer.id;
        productQuantity = answer.quantity;

        connection.query("SELECT * FROM products WHERE item_id=" + productId, function(err, res) {
            selected = res[0];

            if (productQuantity > selected.stock_quantity && selected.stock_quantity > 1) {
                statement = "\nSorry, there are only " + selected.stock_quantity + " " + selected.product_name + "s available.\n"
                console.log(statement.red)
                promptUser();
            } else if (productQuantity > selected.stock_quantity && selected.stock_quantity === 1) {
                statement = "\nSorry, there is only 1 " + selected.product_name + " available.\n"
                console.log(statement.red)
                promptUser();
            } else if (productQuantity > selected.stock_quantity && selected.stock_quantity < 1) {
                statement = "\nSorry, the " + selected.product_name + " is out of stock.\n"
                promptUser();
            } else if (+productQuantity === 1) {
                statement = "\nYou are purchasing 1 " + selected.product_name + ".\n"
                buyProduct();
            } else {
                statement = "\nYou are purchasing " + selected.stock_quantity + " " + selected.product_name + "s.\n"
                buyProduct();
            }
        });
    });
}

// Function to allow the user to view their total and purchase the product
function buyProduct() {
    inquirer.prompt(
        {
            name: "buy",
            type: "confirm",
            message: statement + " Would you like to check out?"
        }
    ).then(function(answer) {
        if (answer.buy) {
            connection.query("UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?", [productQuantity, productId], function(err, res) {
                if (err) {
                    return err
                }
                var total = "\nYour total is $" + (productQuantity * selected.price) + "\n";
                console.log(total.cyan);
                setTimeout(differentProduct, 1000);
            });
        } else {
            differentProduct();
        }
    });
}

// Function to allow the user to select a different product
function differentProduct() {
    inquirer.prompt(
        {
            name: "different",
            type: "confirm",
            message: "Would you like to buy a different product?"
        }
    ).then(function(answer) {
        if (answer.different) {
            showItems();
            setTimeout(promptUser, 1000);
        } else {
            exit();
        }
    });
}

// Function to exit the application
function exit() {
    console.log("\nThank you for visiting Bamazon!\n".blue);
    connection.end();
}