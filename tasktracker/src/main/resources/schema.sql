CREATE TABLE IF NOT EXISTS employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    department VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    description TEXT
);

CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100),
    description TEXT,
    status VARCHAR(50),
    project_id INT,
    employee_id INT,
    assigned_date DATE,
    completed_date DATE,
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (employee_id) REFERENCES employees(id)
);

CREATE TABLE IF NOT EXISTS errors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100),
    description TEXT,
    status VARCHAR(50),
    priority VARCHAR(50),
    clientName VARCHAR(50),
    project_id INT,
    error_date DATE,
    solved DATE,
    FOREIGN KEY (project_id) REFERENCES projects(id)
);

--//status planning,active,onHold,compoleted,cancelled
CREATE TABLE IF NOT EXISTS newmodule (
    id INT AUTO_INCREMENT PRIMARY KEY,
    modulename VARCHAR(100),
    description TEXT,
    status VARCHAR(50),
    priority VARCHAR(50),
    clientName VARCHAR(50),
    project_id INT,
    moduledate DATE,
    FOREIGN KEY (project_id) REFERENCES projects(id)
);

--CREATE TABLE IF NOT EXISTS newtasks (
--    id INT AUTO_INCREMENT PRIMARY KEY,
--    title VARCHAR(100),
--    description TEXT,
--    status VARCHAR(50),
--    project_id INT,
--    employee_id INT,
--    assigned_date DATE,
--    completed_date DATE,
--    FOREIGN KEY (project_id) REFERENCES projects(id),
--    FOREIGN KEY (employee_id) REFERENCES employees(id)
--);