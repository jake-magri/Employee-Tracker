import inquirer from 'inquirer';
import Function from './Functions.js';

class Cli {
async startApp(): Promise<void> {
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
        await Function.viewAllDepartments();
        await this.startApp();
        return;
    } else if (answers.startOptions === 'View all roles') {
        await Function.viewAllRoles();
        await this.startApp();
        return;
    } else if (answers.startOptions === 'View all employees') {
        await Function.viewAllEmployees();
        await this.startApp();
        return;
    } else if (answers.startOptions === 'Add a department') {
        await Function.addADepartment();
        await this.startApp();
        return;
    } else if (answers.startOptions === 'Add an employee') {
        await Function.addAnEmployee();
        await this.startApp();
        return;
    } else if (answers.startOptions === 'Update an employee role') {
        await Function.updateAnEmployeeRole();
        await this.startApp();
        return;
    };
}
}

let cli = new Cli;
cli.startApp();
