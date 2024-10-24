// GIVEN a command-line application that accepts user input
// WHEN I start the application
// THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role

// WHEN I choose to view all departments
// THEN I am presented with a formatted table showing department names and department ids
import inquirer from 'inquirer';
import Function from './functions.js';
// view all roles,
// WHEN I choose to view all roles
// THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
async function startApp() {
    // start prompt for user input
    const answers = await inquirer.prompt([
        {
            type: 'list',
            message: "What would you like to do?",
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role'
            ],
            name: 'startOptions'
        },
    ]);

    if (answers.startOptions === 'View all departments') {
        // imported method from functioons.ts
        Function.viewAllDepartments();
    } else if (answers.startOptions === 'View all roles') {
        Function.viewAllRoles();
    } else if (answers.startOptions === 'View all employees') {
        Function.viewAllEmployees();
    } else if (answers.startOptions === 'Add a department') {
        Function.addADepartment();
    } else if (answers.startOptions === 'Add an employee') {
        Function.addAnEmployee();
    } else if (answers.startOptions === 'Update an employee role') {
        Function.updateAnEmployeeRole();
    };
}

startApp();