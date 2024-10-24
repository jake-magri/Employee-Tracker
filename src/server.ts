// GIVEN a command-line application that accepts user input
// WHEN I start the application
// THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role

// WHEN I choose to view all departments
// THEN I am presented with a formatted table showing department names and department ids
import inquirer from 'inquirer';
// import { QueryResult } from 'pg';
import { pool, connectToDb } from './connection.js';
await connectToDb();

// view all roles,
// WHEN I choose to view all roles
// THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
async function startApp() {
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
        // view all departments
        const result = await pool.query(`SELECT * FROM departments ORDER BY id;`);
        console.table(result.rows);
    } else if (answers.startOptions === 'View all roles') {
        // view all roles
        const result = await pool.query(`SELECT * FROM roles ORDER BY id;`);
        console.table(result.rows);
    }
    // Add additional conditions here for other options
}

startApp();

// view all employees 
// WHEN I choose to view all employees
// THEN I am presented with a formatted table showing employee data, including employee ids, 
// first names, last names, job titles, departments, salaries, and managers that the employees report to
// pool.query(`SELECT * FROM employees ORDER BY id;`);


// // add a department 
// // WHEN I choose to add a department
// // THEN I am prompted to enter the name of the department and that department is added to the database
// pool.query(`INSERT INTO department (id, name) VALUES (name = $1);`, []);
// // add a role, 
// // WHEN I choose to add a role
// // THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database

// pool.query(`INSERT INTO roles (title, salary, department_id) VALUES (title = $1, salary = $2, department_id = $3);`,[]);


// // add an employee, 
// // WHEN I choose to add an employee
// // THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
// pool.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (first_name = $1, last_name = $2, role_id = $3, manager_id = $4);`,[]);

// // update an employee role
// // WHEN I choose to update an employee role
// // THEN I am prompted to select an employee to update and their new role and this information is updated in the database

// pool.query(`UPDATE employee SET role_id = $1;`, []);
