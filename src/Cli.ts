// GIVEN a command-line application that accepts user input
// WHEN I start the application
// THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role

// WHEN I choose to view all departments
// THEN I am presented with a formatted table showing department names and department ids
import inquirer from 'inquirer';
// import { QueryResult } from 'pg';
import { pool, connectToDb } from './connection.js';
await connectToDb();
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
        Function.viewAllDepartments();
    } else if (answers.startOptions === 'View all roles') {
        // view all roles
        const result = await pool.query(`SELECT * FROM roles ORDER BY id;`);
        console.table(result.rows);
    } else if (answers.startOptions === 'View all employees') {
        // view all employees
        const result = await pool.query(`SELECT * FROM employees ORDER BY id;`);
        console.table(result.rows);
    } else if (answers.startOptions === 'Add a department') {
        // prompt to ask for department name
        const departmentSelection = await inquirer.prompt([
            {
                type: 'input',
                message: 'Enter the name of the department',
                name: 'departmentName'
            },
        ]);

        if (departmentSelection) {
            let depName = departmentSelection.departmentName;
            // add a department
            await pool.query(`INSERT INTO departments (name) VALUES ($1);`, [depName]);
            console.log(`${depName} added successfully!`)
        } else {
            console.log('Department name can not be blank.');
        }
    } else if (answers.startOptions === 'Add a role') {
        // prompt to ask for role name, salary, and department names
        const roleSelection = await inquirer.prompt([
            {
                type: 'input',
                message: 'Enter name',
                name: 'roleName'
            },
            {
                type: 'input',
                message: 'Enter salary',
                name: 'salaryValue'
            },
            {
                type: 'input',
                message: "Enter department",
                name: 'roleDepartmentName'
            }
        ]);

        if (roleSelection) { // ensure input is not blank
            let roleName = roleSelection.roleName;
            let salary = roleSelection.salaryValue;
            let department = roleSelection.roleDepartmentName;
            const departmentExists = await pool.query(`SELECT id FROM departments WHERE name = $1`, [department]);

            // check if department exists, if it doesn't user needs to create department using feature.
            if (departmentExists.rows.length === 0) {
                console.log(`Department name "${department}" doesn't exist.`);
            } else {
                // add role
                await pool.query(`INSERT INTO roles (title, salary, department_id) VALUES ( $1, $2, $3);`, [roleName, salary, departmentExists.rows[0].id]);
                console.log('Role added successfully!');
            }
        }
    } else if (answers.startOptions === 'Add an employee') {
        // Get roles from roles table
        const result = await pool.query('SELECT id, title FROM roles');
        const rolesArr = result.rows;

        // Map roles to choices for the prompt
        const roleChoices = rolesArr.map((role) => ({
            name: role.title, // Display name in the prompt
            value: role.id // Value to be used when an option is selected
        }));
        
        const employeeSelection = await inquirer.prompt([
            {
                type: 'input',
                message: 'Enter first name',
                name: 'firstName'
            },
            {
                type: 'input',
                message: 'Enter last name',
                name: 'lastName'
            },
            {
                type: 'list',
                message: 'Select a role',
                name:'role',
                choices: roleChoices
            },
            {
                type: 'input',
                message: 'Enter a manager',
                name:'manager'
            }
        ]);
        if (employeeSelection) {
            let firstName = employeeSelection.firstName;
            let lastName = employeeSelection.lastName;
            let role = employeeSelection.role; // save role object
            let managerNameArr = employeeSelection.manager.split(' ');
            let managerFirstName = managerNameArr[0];
            let managerLastName = managerNameArr[1];
            // get any IDs from db where first name and last name are equal to input
            const managerIsEmployee = await pool.query(`SELECT id FROM employees WHERE first_name = $1 AND last_name = $2`, [managerFirstName, managerLastName]);
            // check if manager is an employee
            if (managerIsEmployee.rows.length === 0) {
                console.log(`${managerNameArr[0]} ${managerNameArr[1]} is not an employee!`);
            } else {
                // add employee
                pool.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4);`, [firstName, lastName, role, managerIsEmployee.rows[0].id]);
                console.log(`Welcome new employee ${employeeSelection.firstName} ${employeeSelection.lastName} to the team.`);
            }
        }        
    } else if (answers.startOptions === 'Update an employee role') {
        
        // Get roles from roles table
        const result = await pool.query('SELECT id, title FROM roles');
        const rolesArr = result.rows;

        // Map roles to choices for the prompt
        const roleChoices = rolesArr.map((role) => ({
            name: role.title, // Display name in the prompt
            value: role.id // Value to be used when an option is selected
        }));

        const answers = await inquirer
        .prompt([
            {
                type:'input',
                message:'Enter employee first name',
                name: 'firstName'
            },
            {
                type:'input',
                message:'Enter employee last name',
                name: 'lastName'
            },
            {
                type:'list',
                message:'Select a new role',
                name:'role',
                choices: roleChoices
            }
        ]);
        // update employee role
        await pool.query(`UPDATE employees SET role_id = $1 WHERE first_name = $2 AND last_name = $3;`, [answers.role, answers.firstName, answers.lastName]);
        console.log(`Employee ${answers.firstName} ${answers.lastName} updated successfully`)
    };
}

startApp();