SET FOREIGN_KEY_CHECKS = 0;  

-- ==================== DROP EXISTING TABLES (order matters) ====================
DROP TABLE IF EXISTS error_history;
DROP TABLE IF EXISTS errors;
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS modules;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS employees;

-- ==================== EMPLOYEES ====================
CREATE TABLE employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    department VARCHAR(100),
    is_active TINYINT(1) DEFAULT 1,
    joining_date DATE,
    leaving_date DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================== PROJECTS ====================
CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    projecthead VARCHAR(100),      
    projectmanager VARCHAR(100),
    status VARCHAR(50) DEFAULT 'planning',
    start_date DATE,        
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================== MODULES ====================
CREATE TABLE modules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'active',
    priority VARCHAR(50) DEFAULT 'Medium',
    client_name VARCHAR(100),
    project_id INT NOT NULL,
    module_lead INT NULL,
    start_date DATE,
    completed_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (module_lead) REFERENCES employees(id) ON DELETE SET NULL
);

-- ==================== TASKS ====================
CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'Assigned',
    priority VARCHAR(50) DEFAULT 'Medium',
    project_id INT NOT NULL,
    module_id INT NULL,
    employee_id INT NOT NULL,
    error_id INT NULL,
    due_date DATE,
    assigned_date DATE,
    completed_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE SET NULL,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (error_id) REFERENCES errors(id) ON DELETE SET NULL
);

-- ==================== ERRORS ====================
CREATE TABLE errors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'Open',
    priority VARCHAR(50) DEFAULT 'Medium',
    client_name VARCHAR(100),
    project_id INT NOT NULL,
    module_id INT NULL,
    reported_by INT NULL,
    assigned_to INT NULL,
    resolved_by INT NULL,
    error_date DATE,
    solved_date DATE,
    reopen_count INT DEFAULT 0,
    resolution_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE SET NULL,
    FOREIGN KEY (reported_by) REFERENCES employees(id) ON DELETE SET NULL,
    FOREIGN KEY (assigned_to) REFERENCES employees(id) ON DELETE SET NULL,
    FOREIGN KEY (resolved_by) REFERENCES employees(id) ON DELETE SET NULL
);

-- ==================== ERROR HISTORY ====================
CREATE TABLE error_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    error_id INT NOT NULL,
    action VARCHAR(50) NOT NULL,
    description TEXT,
    changed_by INT NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    old_status VARCHAR(50),
    new_status VARCHAR(50),
    FOREIGN KEY (error_id) REFERENCES errors(id) ON DELETE CASCADE,
    FOREIGN KEY (changed_by) REFERENCES employees(id) ON DELETE SET NULL
);

-- ==================== INDEXES ====================
CREATE INDEX idx_employee_email ON employees(email);
CREATE INDEX idx_employee_active ON employees(is_active);
CREATE INDEX idx_project_status ON projects(status);
CREATE INDEX idx_module_project ON modules(project_id);
CREATE INDEX idx_module_lead ON modules(module_lead);
CREATE INDEX idx_task_employee ON tasks(employee_id);
CREATE INDEX idx_task_project ON tasks(project_id);
CREATE INDEX idx_error_status ON errors(status);
CREATE INDEX idx_error_project ON errors(project_id);
CREATE INDEX idx_error_module ON errors(module_id);
CREATE INDEX idx_error_reported ON errors(reported_by);
CREATE INDEX idx_error_assigned ON errors(assigned_to);
CREATE INDEX idx_error_resolved ON errors(resolved_by);
CREATE INDEX idx_history_error ON error_history(error_id);
CREATE INDEX idx_history_changed_at ON error_history(changed_at);

SET FOREIGN_KEY_CHECKS = 1;