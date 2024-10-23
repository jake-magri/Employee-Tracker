SELECT * FROM department ORDER BY id;

SELECT * FROM roles ORDER BY id;

SELECT * FROM employees ORDER BY id;

INSERT INTO department (id, name)
VALUES (
    name = $1
);

INSERT INTO roles (title, salary, department_id)
VALUES (
    title = $1, 
    salary = $2, 
    department_id = $3
);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES (
    first_name = $1, 
    last_name = $2, 
    role_id = $3,
    manager_id = $4
);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES (
    first_name = $1, 
    last_name = $2, 
    role_id = $3,
    manager_id = $4
);

UPDATE employee
SET role_id = $1;