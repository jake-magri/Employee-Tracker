import inquirer from 'inquirer';
import { pool, connectToDb } from '../connection.js';
await connectToDb();

// create class with methods to update db

class Cli {
    
    exit: boolean = false;
    
    async viewAllDepartments(): Promise<void> {
        // view all departments with attribute aliases
        const result = await pool.query(`SELECT id AS Department_ID, departments.name AS Department_Name FROM departments ORDER BY id;`);
        console.table(result.rows);
    }

    async viewAllRoles(): Promise<void> {
        // view all roles
        const result = await pool.query(`SELECT roles.id AS Role_ID, roles.title AS job_title,roles.salary, departments.name as department_name FROM roles JOIN departments ON roles.department_id = departments.id ORDER BY roles.id;`);
        console.table(result.rows);
    }

    async viewAllEmployees(): Promise<void> {
        // view all employees
        const result = await pool.query(
            `SELECT employees.id AS id, employees.first_name, employees.last_name, COALESCE(departments.name, 'null') AS department_name, roles.title as job_title, COALESCE(manager.first_name, 'null') AS manager_first_name, COALESCE(manager.last_name, 'null') AS manager_last_name 
                    FROM employees
                    JOIN roles ON employees.role_id = roles.id
                    LEFT JOIN departments ON roles.department_id = departments.id 
                    LEFT JOIN employees as manager ON employees.manager_id = manager.id ORDER BY employees.id;`
        );
        console.table(result.rows);
    }

    async addADepartment(): Promise<void> {
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
    }

    async addARole(): Promise<void> {
        // prompt to ask for role name, salary, and department names
        try {
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
                const roleName = roleSelection.roleName;
                const salary = parseFloat(roleSelection.salaryValue);
                const department = roleSelection.roleDepartmentName;
                const departmentExists = await pool.query(`SELECT id FROM departments WHERE name = $1;`, [department]);
                // check if department exists, if it doesn't user needs to create department using feature.
                if (departmentExists.rows.length === 0) {
                    console.log(`Department name "${department}" doesn't exist.`);
                } else {
                    // add role
                    await pool.query(`INSERT INTO roles (title, salary, department_id) VALUES ( $1, $2, $3);`, [roleName, salary, departmentExists.rows[0].id]);
                    console.log('Role added successfully!');
                }
            }
        } catch (error) {
            console.error('Error occurred trying to get data from user:', error);
            return;
        }
    }

    async addAnEmployee(): Promise<void> {
        // Get roles from roles table
        const result = await pool.query(`SELECT id, title FROM roles;`);
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
                name: 'role',
                choices: roleChoices
            },
            {
                type: 'input',
                message: 'Enter manager first name',
                name: 'managerFirstName'
            },
            {
                type: 'input',
                message: 'Enter manager last name',
                name: 'managerLastName'
            }
        ]);
        if (employeeSelection) {
            let firstName = employeeSelection.firstName;
            let lastName = employeeSelection.lastName;
            let role = employeeSelection.role; // save role object
            let managerFirstName = employeeSelection.managerFirstName;
            let managerLastName = employeeSelection.managerLastName;
            // get any IDs from db where first name and last name are equal to input
            const managerIsEmployee = await pool.query(`SELECT id FROM employees WHERE first_name = $1 AND last_name = $2`, [managerFirstName, managerLastName]);
            // check if manager is an employee
            if (managerIsEmployee.rows.length === 0) {
                console.log('${managerFirstName} ${managerLastName} is not an employee!');
            } else {
                // add employee
                await pool.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4);`, [firstName, lastName, role, managerIsEmployee.rows[0].id]);
                console.log(`Welcome new employee ${employeeSelection.firstName} ${employeeSelection.lastName} to the team!`);
            }
        }
    }

    async updateAnEmployeeRole(): Promise<void> {
        // Get roles from roles table
        const result = await pool.query('SELECT id, title FROM roles;');
        const rolesArr = result.rows;

        // Map roles to choices for the prompt
        const roleChoices = rolesArr.map((role) => ({
            name: role.title, // Display name in the prompt
            value: role.id // Value to be used when an option is selected
        }));

        const answers = await inquirer.prompt([
            {
                type: 'input',
                message: 'Enter employee first name',
                name: 'firstName'
            },
            {
                type: 'input',
                message: 'Enter employee last name',
                name: 'lastName'
            },
            {
                type: 'list',
                message: 'Select a new role',
                name: 'role',
                choices: roleChoices
            }
        ]);
        // update employee role
        await pool.query(`UPDATE employees SET role_id = $1 WHERE first_name = $2 AND last_name = $3;`, [answers.role, answers.firstName, answers.lastName]);
        console.log(`Employee ${answers.firstName} ${answers.lastName} updated successfully!`)
    }

    // view the total utilized budget of a department—in other words, the combined salaries of all employees in that department
    async viewTotalBudgetOfDept(): Promise<void> {
        // get all employees roles salaries and sum them for total spend
        const result = await pool.query(
            `SELECT departments.name AS department_name, 
            SUM(roles.salary) AS total_salary_spend
            FROM employees
            JOIN roles ON employees.role_id = roles.id
            JOIN departments ON roles.department_id = departments.id
            GROUP BY departments.name
            ORDER BY departments.name;`
        );
        console.table(result.rows);
    }
    
    async startApp(): Promise<void> {
        try {
            // start prompt for user input
            const answers = await inquirer.prompt([
                {
                    type: 'list',
                    message: "What would you like to do?",
                    choices: [
                        'View total utilized labor budget by department',
                        'View all departments',
                        'View all roles',
                        'View all employees',
                        'Add a department',
                        'Add a role',
                        'Add an employee',
                        'Update an employee role',
                        'Exit'
                    ],
                    name: 'startOptions'
                }
            ]);

            if (answers.startOptions === 'View all departments') {
                // imported method from functioons.ts
                await this.viewAllDepartments();
                // recustive call to return user to top level prompt
                // await to load complete table and then return prompt
                await this.startApp();
                // return ensures no runon code or leaking
                return;
            } else if (answers.startOptions === 'View all roles') {
                await this.viewAllRoles();
                await this.startApp();
                return;
            } else if (answers.startOptions === 'View all employees') {
                await this.viewAllEmployees();
                await this.startApp();
                return;
            } else if (answers.startOptions === 'Add a department') {
                await this.addADepartment();
                await this.startApp();
                return;
            } else if (answers.startOptions === 'Add a role') {
                await this.addARole();
                await this.startApp();
                return;
            } else if (answers.startOptions === 'Add an employee') {
                await this.addAnEmployee();
                await this.startApp();
                return;
            } else if (answers.startOptions === 'Update an employee role') {
                await this.updateAnEmployeeRole();
                await this.startApp();
                return;
            } else if (answers.startOptions === 'View total utilized labor budget by department') {
                await this.viewTotalBudgetOfDept();
                await this.startApp();
                return;
            } else {
                // Ends the process
                process.exit(0);
            };
        } catch (error) {
            console.error('Error calling Cli methods:', error);
        }
    }

};

export default new Cli;