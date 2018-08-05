// Dependencies
var mysql = require("mysql");
var inquirer = require("inquirer");
var table = require("console.table");
var colors = require("colors");
var itemId = 0;
var quantity = 0;

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
    ])
}

function exit() {
    console.log("\nThank you for visiting Bamazon!\n".blue);
    connection.end();
}