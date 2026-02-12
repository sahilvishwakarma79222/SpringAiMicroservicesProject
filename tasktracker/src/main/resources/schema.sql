CREATE TABLE IF NOT EXISTS employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    department VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    description TEXT,
    status VARCHAR(50) DEFAULT 'planning'  -- planning, active, onHold, completed, cancelled
);

CREATE TABLE IF NOT EXISTS modules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    description TEXT,
    status VARCHAR(50),       -- planning, active, completed
    priority VARCHAR(50),
    client_name VARCHAR(50),
    project_id INT,
    start_date DATE,
    completed_date DATE,
    FOREIGN KEY (project_id) REFERENCES projects(id)
);

CREATE TABLE IF NOT EXISTS errors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100),
    description TEXT,
    status VARCHAR(50),
    priority VARCHAR(50),
    client_name VARCHAR(50),
    project_id INT,
    module_id INT NULL,
    reported_by INT NULL,
    assigned_to INT NULL,
    error_date DATE,
    solved_date DATE,
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (module_id) REFERENCES modules(id),
    FOREIGN KEY (reported_by) REFERENCES employees(id),
    FOREIGN KEY (assigned_to) REFERENCES employees(id)
);

CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100),
    description TEXT,
    status VARCHAR(50),
    priority VARCHAR(50),
    project_id INT,
    module_id INT NULL,
    employee_id INT,
    error_id INT NULL,
    assigned_date DATE,
    completed_date DATE,
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (module_id) REFERENCES modules(id),
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (error_id) REFERENCES errors(id)
);