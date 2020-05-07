var inquirer = require("inquirer");
var mysql = require("mysql");
const cTable = require('console.table');

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
                choices: ["Add Departments", "Add Roles", "Add Employee", "View Departments", "View Roles", "View Employees", "Update Employee Roles"]
            }
        ]
    ).then(answers => {
        switch (answers.start) {
            case "Add Departments":
                addDepartment();
                break;
            case "Add Roles":
                addRole();
                break;
            case "Add Employee":
                addEmployee();
                break;
            case "View Departments":
                viewDepartments();
                break;
            case "View Roles":
                viewRoles();
                break;
            case "View Employees":
                viewEmployees();
                break;
            case "Update Employee Roles":
                updateER();
                break;


        }
    })
}

function addDepartment() {
    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "What's the name of the new department?"
        }
    ]).then(answers => {
        connection.query("INSERT INTO department (department_name) VALUES (?)", [answers.name], (err, result) => {
            if (err) throw err;
            console.log("New Department Added");
            initialQuestion();
        })
    });

}

function addRole() {
    let departments = [];
    connection.query("SELECT * FROM department", function (err, data) {
        if (err) throw err;
        data.forEach(element => {
            departments.push(element.department_name);
        });


        inquirer.prompt(
            [
                {
                    type: "input",
                    name: "title",
                    message: "Title of the new role?"
                },
                {
                    type: "input",
                    name: "salary",
                    message: "Input salary of new role"
                },
                {
                    type: "list",
                    name: "dept",
                    message: "Choose the department",
                    choices: departments
                }
            ]).then(answers => {
                let dept;
                connection.query("SELECT id FROM department WHERE name=?", [answers.dept], (err, data) => {
                    if (err) throw err;
                    data.forEach(element => {
                        dept = element.id;
                    });
                    connection.query('INSERT INTO _role (title , salary, department_id) VALUES (?,?,?)', [answers.title, answers.salary, dept]);
                    console.clear();
                    initialQuestion();
                });


            })
    });
}
function addEmployee() {
    let roles = [];
    let managers = ["There is no Manager"];

    connection.query("SELECT * FROM _role", (err, data) => {
        if (err) throw err;

        data.forEach(element => {
            roles.push(element.title)
        });

        connection.query("SELECT * FROM employee", (err, result) => {
            result.forEach(element => managers.push(element.first_name));

            inquirer.prompt([
                {
                    type: "input",
                    name: "firstName",
                    message: "What is the employee's first name?",
                },
                {
                    type: "input",
                    name: "lastName",
                    message: "What is the employee's last name?",
                },
                {
                    type: "rawlist",
                    name: "role",
                    message: "What is the employee's role?",
                    choices: roles
                },
                {
                    type: "list",
                    name: "manager",
                    message: "Who is the employee's manager?",
                    choices: managers
                }
            ]).then(answers => {
                let role = data.find(element => element.title == answers.role);

                let manager = result.find(element => element.first_name == answers.manager);
                let managerID;
                if (manager) {
                    managerID = manager.id;
                } else {
                    managerID = null;
                }

                connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [answers.firstName, answers.lastName, role.id, managerID], (err, res) => {
                    if (err) throw err;
                    console.log("Employee added");
                    initialQuestion();
                });
            })
        })

    })
}

function viewDepartments() {
    connection.query(`SELECT * FROM department`, (err, data) => {
        console.table(data);
    });
    initialQuestion();
}

function viewRoles() {
    connection.query(`SELECT * FROM _role
    LEFT JOIN department
    ON _role.department_id = department.id`, (err, data) => {
        console.table(data);
    });
    initialQuestion();
}

function viewEmployees() {
    connection.query(`SELECT first_name, last_name, title, salary, department_name FROM employee
    LEFT JOIN _role
    ON employee.role_id = _role.id
    LEFT JOIN department
    ON _role.department_id = department.id;`, (err, data) => {
        console.table(data);
    });
    initialQuestion();
}

function updateER() {
    let employee = [];
    connection.query("SELECT * FROM employee", function (err, res) {
        res.forEach(element => {
            employee.push(element.first_name);
        });
        inquirer.prompt(
            [
                {
                    type: "list",
                    name: "nameEmployee",
                    message: "Which Employee?",
                    choices: employee
                }
            ]
        ).then(answers => {
            let update;
            connection.query("SELECT role_id  FROM employee WHERE first_name = ? ", [answers.nameEmployee], (err, data) => {
                data.forEach(element => {
                    update = element.role_id;
                });
                let roleTitle = [];
                connection.query("SELECT * FROM _role", function (err, rolres) {
                    rolres.forEach(element => {
                        roleTitle.push(element.title);
                    });
                    inquirer.prompt([
                        {
                            type: "list",
                            name: "updateRole",
                            message: "Choose Role",
                            choices: roleTitle
                        }
                    ]).then(answers=>{
                        connection.query("UPDATE _role SET title = ? WHERE id = ?", [answers.updateRole, update]);
                        console.log("SUCCESS");
                        initialQuestion();
                    })
                })
            })
        })
    })
}

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    initialQuestion();
});