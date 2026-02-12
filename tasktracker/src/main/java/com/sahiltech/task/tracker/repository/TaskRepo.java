package com.sahiltech.task.tracker.repository;

import com.sahiltech.task.tracker.dto.TaskProjectionMapper;
import com.sahiltech.task.tracker.dto.TaskRowMapper;
import com.sahiltech.task.tracker.model.Task;
import com.sahiltech.task.tracker.model.TaskProjection;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Repository
public class TaskRepo {

 

     private final JdbcTemplate jdbcTemplate;

    public TaskRepo(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // ------------------ SQL QUERIES ------------------

    private static final String SQL_INSERT = """
        INSERT INTO tasks 
        (title, description, status, priority, project_id, module_id, employee_id, error_id, assigned_date, completed_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """;

    private static final String SQL_UPDATE = """
        UPDATE tasks 
        SET title=?, description=?, status=?, priority=?, project_id=?, module_id=?, employee_id=?, error_id=?, assigned_date=?, completed_date=? 
        WHERE id=?
    """;

     private static final String SQL_GET_BY_ID = "SELECT * FROM tasks WHERE id=?";
    private static final String SQL_DELETE_BY_ID = "DELETE FROM tasks WHERE id=?";
    private static final String SQL_GET_ALL = "SELECT * FROM tasks";
    private static final String SQL_GET_BY_PROJECT = "SELECT * FROM tasks WHERE project_id=?";
    private static final String SQL_GET_BY_EMPLOYEE = "SELECT * FROM tasks WHERE employee_id=?";

     // ------------------ CRUD OPERATIONS ------------------

    public Task saveTask(Task task) {
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update((Connection connection) -> {
            PreparedStatement ps = connection.prepareStatement(SQL_INSERT, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, task.getTitle());
            ps.setString(2, task.getDescription());
            ps.setString(3, task.getStatus());
            ps.setString(4, task.getPriority());
            ps.setObject(5, task.getProjectId());
            ps.setObject(6, task.getModuleId());
            ps.setObject(7, task.getEmployeeId());
            ps.setObject(8, task.getErrorId());
            ps.setObject(9, task.getAssignedDate());
            ps.setObject(10, task.getCompletedDate());
            return ps;
        }, keyHolder);

        if (keyHolder.getKey() != null) {
            task.setId(keyHolder.getKey().longValue());
        }
        return task;
    }

    public Task getById(Long id) {
        return jdbcTemplate.queryForObject(SQL_GET_BY_ID, new TaskRowMapper(), id);
    }

    public List<Task> getByEmployeeId(Long employeeId) {
        return jdbcTemplate.query(SQL_GET_BY_EMPLOYEE, new TaskRowMapper(), employeeId);
    }

    public List<Task> getByProjectId(Long projectId) {
        return jdbcTemplate.query(SQL_GET_BY_PROJECT, new TaskRowMapper(), projectId);
    }

    public List<Task> getAllTasks() {
        return jdbcTemplate.query(SQL_GET_ALL, new TaskRowMapper());
    }

    public String updateTask(Long id, Task task) {
        jdbcTemplate.update(SQL_UPDATE,
                task.getTitle(),
                task.getDescription(),
                task.getStatus(),
                task.getPriority(),
                task.getProjectId(),
                task.getModuleId(),
                task.getEmployeeId(),
                task.getErrorId(),
                task.getAssignedDate(),
                task.getCompletedDate(),
                id
        );
        return "Task updated successfully with id " + id;
    }

    public String deleteTask(Long id) {
        jdbcTemplate.update(SQL_DELETE_BY_ID, id);
        return "Task deleted successfully with id " + id;
    }

    // ------------------ SMART PAGINATION ------------------

    public Map<String, Object> getTasksSmartPagination(

            int pageNumber,
            int pageSize,
            String sortBy,
            String sortDir,
            String searchTerm
    ) {
        if (sortBy == null || sortBy.isEmpty()) sortBy = "t.id";
        if (sortDir == null || sortDir.isEmpty()) sortDir = "asc";
        if (pageNumber < 1) pageNumber = 1;
        if (pageSize < 1) pageSize = 10;

        int offset = (pageNumber - 1) * pageSize;

        String baseQuery = """
            FROM tasks t
            LEFT JOIN employees e ON t.employee_id = e.id
            LEFT JOIN projects p ON t.project_id = p.id
        """;

        StringBuilder sql = new StringBuilder("""
            SELECT t.id, t.title, t.status, t.priority, t.assigned_date, t.completed_date, 
                   e.name AS employeeName, p.name AS projectName
        """);
        sql.append(baseQuery);

        List<Object> params = new ArrayList<>();

        // 🔍 Search
        if (searchTerm != null && !searchTerm.isEmpty()) {
            sql.append(" WHERE LOWER(t.title) LIKE ? OR LOWER(t.status) LIKE ? OR LOWER(e.name) LIKE ? OR LOWER(p.name) LIKE ?");
            String search = "%" + searchTerm.toLowerCase() + "%";
            params.add(search);
            params.add(search);
            params.add(search);
            params.add(search);
        }

        // 🔽 Sorting
        sql.append(" ORDER BY ").append(sortBy).append(" ").append(sortDir.equalsIgnoreCase("desc") ? "DESC" : "ASC");

        // 📄 Pagination
        sql.append(" LIMIT ? OFFSET ?");
        params.add(pageSize);
        params.add(offset);

        List<TaskProjection> tasks = jdbcTemplate.query(sql.toString(), new TaskProjectionMapper(), params.toArray());

        // 📊 Count
        StringBuilder countSql = new StringBuilder("SELECT COUNT(*) ").append(baseQuery);
        List<Object> countParams = new ArrayList<>();

        if (searchTerm != null && !searchTerm.isEmpty()) {
            countSql.append(" WHERE LOWER(t.title) LIKE ? OR LOWER(t.status) LIKE ? OR LOWER(e.name) LIKE ? OR LOWER(p.name) LIKE ?");
            String search = "%" + searchTerm.toLowerCase() + "%";
            countParams.add(search);
            countParams.add(search);
            countParams.add(search);
            countParams.add(search);
        }

        int totalRecords = jdbcTemplate.queryForObject(countSql.toString(), Integer.class, countParams.toArray());
        int totalPages = (int) Math.ceil((double) totalRecords / pageSize);

        // 🧾 Final result
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("results", tasks);
        result.put("totalRecords", totalRecords);
        result.put("totalPages", totalPages);
        result.put("currentPage", pageNumber);
        result.put("pageSize", pageSize);
        result.put("sortBy", sortBy);
        result.put("sortDir", sortDir);
        result.put("searchTerm", searchTerm);

        return result;
    }


    public Map<String, Object> getByEmployeeIdSmart(
            Long employeeId,
            int pageNumber,
            int pageSize,
            String sortBy,
            String sortDir,
            String searchTerm
    ) {
        if (sortBy == null || sortBy.isEmpty()) sortBy = "t.id";
        if (sortDir == null || sortDir.isEmpty()) sortDir = "asc";
        if (pageNumber < 1) pageNumber = 1;
        if (pageSize < 1) pageSize = 10;

        int offset = (pageNumber - 1) * pageSize;

        String baseQuery = """
            FROM tasks t
            LEFT JOIN employees e ON t.employee_id = e.id
            LEFT JOIN projects p ON t.project_id = p.id
            WHERE t.employee_id = ?
        """;

        StringBuilder sql = new StringBuilder("""
            SELECT t.id, t.title, t.status, t.priority, t.assigned_date, t.completed_date,
                   e.name AS employeeName, p.name AS projectName
        """);

        sql.append(baseQuery);

        List<Object> params = new ArrayList<>();
        params.add(employeeId);

        // 🔍 Optional search
        if (searchTerm != null && !searchTerm.isEmpty()) {
            sql.append(" AND (LOWER(t.title) LIKE ? OR LOWER(t.status) LIKE ? OR LOWER(p.name) LIKE ?)");
            String search = "%" + searchTerm.toLowerCase() + "%";
            params.add(search);
            params.add(search);
            params.add(search);
        }

        // 🔽 Sorting
        sql.append(" ORDER BY ")
           .append(sortBy)
           .append(" ")
           .append(sortDir.equalsIgnoreCase("desc") ? "DESC" : "ASC");

        // 📄 Pagination
        sql.append(" LIMIT ? OFFSET ?");
        params.add(pageSize);
        params.add(offset);

        List<TaskProjection> tasks =
                jdbcTemplate.query(sql.toString(), new TaskProjectionMapper(), params.toArray());

        // 📊 Count query
        StringBuilder countSql = new StringBuilder("SELECT COUNT(*) ").append(baseQuery);
        List<Object> countParams = new ArrayList<>();
        countParams.add(employeeId);

        if (searchTerm != null && !searchTerm.isEmpty()) {
            countSql.append(" AND (LOWER(t.title) LIKE ? OR LOWER(t.status) LIKE ? OR LOWER(p.name) LIKE ?)");
            String search = "%" + searchTerm.toLowerCase() + "%";
            countParams.add(search);
            countParams.add(search);
            countParams.add(search);
        }

        int totalRecords = jdbcTemplate.queryForObject(
                countSql.toString(),
                Integer.class,
                countParams.toArray()
        );

        int totalPages = (int) Math.ceil((double) totalRecords / pageSize);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("results", tasks);
        result.put("totalRecords", totalRecords);
        result.put("totalPages", totalPages);
        result.put("currentPage", pageNumber);
        result.put("pageSize", pageSize);
        result.put("sortBy", sortBy);
        result.put("sortDir", sortDir);
        result.put("searchTerm", searchTerm);

        return result;
    }


    public Map<String, Object> getByProjectIdSmart(
            Long projectId,
            int pageNumber,
            int pageSize,
            String sortBy,
            String sortDir,
            String searchTerm
    ) {
        if (sortBy == null || sortBy.isEmpty()) sortBy = "t.id";
        if (sortDir == null || sortDir.isEmpty()) sortDir = "asc";
        if (pageNumber < 1) pageNumber = 1;
        if (pageSize < 1) pageSize = 10;

        int offset = (pageNumber - 1) * pageSize;

        String baseQuery = """
        FROM tasks t
        LEFT JOIN employees e ON t.employee_id = e.id
        LEFT JOIN projects p ON t.project_id = p.id
        WHERE t.project_id = ?
    """;

        StringBuilder sql = new StringBuilder("""
        SELECT t.id, t.title, t.status, t.priority, t.assigned_date, t.completed_date,
               e.name AS employeeName, p.name AS projectName
    """);
        sql.append(baseQuery);

        List<Object> params = new ArrayList<>();
        params.add(projectId);

        // 🔍 Optional search
        if (searchTerm != null && !searchTerm.isEmpty()) {
            sql.append(" AND (LOWER(t.title) LIKE ? OR LOWER(t.status) LIKE ? OR LOWER(e.name) LIKE ?)");
            String search = "%" + searchTerm.toLowerCase() + "%";
            params.add(search);
            params.add(search);
            params.add(search);
        }

        // 🔽 Sorting
        sql.append(" ORDER BY ").append(sortBy).append(" ").append(sortDir.equalsIgnoreCase("desc") ? "DESC" : "ASC");

        // 📄 Pagination
        sql.append(" LIMIT ? OFFSET ?");
        params.add(pageSize);
        params.add(offset);

        List<TaskProjection> tasks = jdbcTemplate.query(sql.toString(), new TaskProjectionMapper(), params.toArray());

        // 📊 Count query
        StringBuilder countSql = new StringBuilder("SELECT COUNT(*) ").append(baseQuery);
        List<Object> countParams = new ArrayList<>();
        countParams.add(projectId);

        if (searchTerm != null && !searchTerm.isEmpty()) {
            countSql.append(" AND (LOWER(t.title) LIKE ? OR LOWER(t.status) LIKE ? OR LOWER(e.name) LIKE ?)");
            String search = "%" + searchTerm.toLowerCase() + "%";
            countParams.add(search);
            countParams.add(search);
            countParams.add(search);
        }

        int totalRecords = jdbcTemplate.queryForObject(countSql.toString(), Integer.class, countParams.toArray());
        int totalPages = (int) Math.ceil((double) totalRecords / pageSize);

        // 🧾 Final response
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("results", tasks);
        result.put("totalRecords", totalRecords);
        result.put("totalPages", totalPages);
        result.put("currentPage", pageNumber);
        result.put("pageSize", pageSize);
        result.put("sortBy", sortBy);
        result.put("sortDir", sortDir);
        result.put("searchTerm", searchTerm);

        return result;
    }

}
