-- As the image illustrates, your schema should contain the following three tables:

-- Deletes and creates a fresh database
-- Functionally tested
DROP DATABASE IF EXISTS employee_tracker_db;
CREATE DATABASE employee_tracker_db;

\c employee_tracker_db;

-- Creates department table with 2 attributes.
-- Drops table if exists, starting fresh.
-- Functionally tested.
DROP TABLE IF EXISTS department;
CREATE TABLE department (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) UNIQUE NOT NULL
);

-- Creates role table with 4 attributes.
-- Drops table if exists, starting fresh.
-- Functionally tested.
DROP TABLE IF EXISTS role;
CREATE TABLE role (
    id SERIAL PRIMARY KEY,
    title VARCHAR(30) UNIQUE NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INTEGER NOT NULL
);

-- Creates role table with 6 attributes.
-- Drops table if exists, starting fresh.
-- Functionally tested.
-- Added FOREIGN KEY relation to manager id.
-- Functionally tested.
DROP TABLE IF EXISTS employee;
CREATE TABLE employee (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    role_id INTEGER NOT NULL,
    manager_id INTEGER,
    FOREIGN KEY (manager_id)
    REFERENCES employee(id)
    ON DELETE SET NULL
);

-- * `employee`

--   * `id`: `SERIAL PRIMARY KEY`

--   * `first_name`: `VARCHAR(30) NOT NULL` to hold employee first name

--   * `last_name`: `VARCHAR(30) NOT NULL` to hold employee last name

--   * `role_id`: `INTEGER NOT NULL` to hold reference to employee role

--   * `manager_id`: `INTEGER` to hold reference to another employee that is the manager of the current employee (`null` if the employee has no manager)