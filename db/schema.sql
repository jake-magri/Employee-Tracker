-- As the image illustrates, your schema should contain the following three tables:

-- Deletes and creates a fresh database
-- Functionally tested
DROP DATABASE IF EXISTS employee_tracker_db;
CREATE DATABASE employee_tracker_db;

\c employee_tracker_db;

-- Creates department table with 2 attributes.
-- Drops table if exists, starting fresh.
-- Functionally tested.
DROP TABLE IF EXISTS departments;
CREATE TABLE departments (
    id SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(30) UNIQUE NOT NULL
);

-- Creates role table with 4 attributes.
-- Drops table if exists, starting fresh.
-- Functionally tested.
-- Added FOREGIN KEY relation to manager id.
-- Functionally tested.
DROP TABLE IF EXISTS roles;
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(60) UNIQUE NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INTEGER,
    FOREIGN KEY (department_id)
    REFERENCES departments(id)
);

-- Creates role table with 6 attributes.
-- Drops table if exists, starting fresh.
-- Functionally tested.
-- Added FOREIGN KEY relation to manager id.
-- Functionally tested.
DROP TABLE IF EXISTS employees;
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL,
    manager_id INTEGER,
    FOREIGN KEY (manager_id)
    REFERENCES employees(id)
    ON DELETE SET NULL
);