var inquirer = require("inquirer");
var mysql = require("mysql");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Daniela8!",
    database: "trackerDB"
});

function initialQuestion() {
    inquirer.prompt(
        [
            {
                type: "list",
                name: "start",
                message: "What would you like to do? ",
                choices: ["Add departments", "Add roles", "Add employee", "View departments", "View roles", "View employees", "Update employee roles"]
            }
        ]
    ).then(answers => {
        switch (answers.start) {
            case "Add departments":
                break;
            case "Add roles":
                break;
            case "Add employee":
                break;
            case "View departments":
                break;
            case "View roles":
                break;
            case "View employees":
                break;
            case "Update employee roles":
                break;


        }
    })
}

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
});