package com.sahiltech.task.tracker.repository;

import com.sahiltech.task.tracker.dto.NewModuleTaskRowMapper;
import com.sahiltech.task.tracker.model.NewModuleTask;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.*;

@Repository
public class NewModuleTaskRepo {

    private final JdbcTemplate jdbcTemplate;

    public NewModuleTaskRepo(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final String sqlCreate = "INSERT INTO newtasks(title, description, status, project_id, employee_id, assigned_date, completed_date) VALUES (?, ?, ?, ?, ?, ?, ?)";
    private final String sqlGetById = "SELECT * FROM newtasks WHERE id = ?";
    private final String sqlDeleteById = "DELETE FROM newtasks WHERE id = ?";
    private final String sqlUpdateById = "UPDATE newtasks SET title=?, description=?, status=?, project_id=?, employee_id=?, assigned_date=?, completed_date=? WHERE id=?";
    private final String sqlGetAll = "SELECT * FROM newtasks";
    private final String sqlGetAllCount = "SELECT COUNT(*) FROM newtasks";

    public int countAllTasks() {
        return jdbcTemplate.queryForObject(sqlGetAllCount, Integer.class);
    }

    public NewModuleTask saveTask(NewModuleTask task) {
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sqlCreate, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, task.getTitle());
            ps.setString(2, task.getDescription());
            ps.setString(3, task.getStatus());
            ps.setLong(4, task.getProjectid());
            ps.setLong(5, task.getEmployeeid());
            ps.setObject(6, task.getAssigneddate());
            ps.setObject(7, task.getCompleteddate());
            return ps;
        }, keyHolder);

        if (keyHolder.getKey() != null) {
            task.setId(keyHolder.getKey().longValue());
        }
        return task;
    }

    public NewModuleTask getById(Long id) {
        return jdbcTemplate.queryForObject(sqlGetById, new NewModuleTaskRowMapper(), id);
    }

    public String deleteTask(long id) {
        jdbcTemplate.update(sqlDeleteById, id);
        return "Task deleted successfully with id " + id;
    }

    public String updateTask(long id, NewModuleTask task) {
        jdbcTemplate.update(sqlUpdateById,
                task.getTitle(),
                task.getDescription(),
                task.getStatus(),
                task.getProjectid(),
                task.getEmployeeid(),
                task.getAssigneddate(),
                task.getCompleteddate(),
                id
        );
        return "Task updated successfully with id " + id;
    }

    public List<NewModuleTask> getAllTasks() {
        return jdbcTemplate.query(sqlGetAll, new NewModuleTaskRowMapper());
    }

    public Map<String, Object> getTasksSmartPagination(
            int pageNumber,
            int pageSize,
            String sortBy,
            String sortDir,
            String searchTerm
    ) {
        if (sortBy == null || sortBy.isEmpty()) sortBy = "id";
        if (sortDir == null || sortDir.isEmpty()) sortDir = "asc";
        if (pageNumber < 1) pageNumber = 1;
        if (pageSize < 1) pageSize = 10;

        int offset = (pageNumber - 1) * pageSize;
        StringBuilder sql = new StringBuilder("SELECT * FROM newtasks");
        List<Object> params = new ArrayList<>();

        if (searchTerm != null && !searchTerm.isEmpty()) {
            sql.append(" WHERE LOWER(title) LIKE ? OR LOWER(description) LIKE ?");
            params.add("%" + searchTerm.toLowerCase() + "%");
            params.add("%" + searchTerm.toLowerCase() + "%");
        }

        sql.append(" ORDER BY ").append(sortBy).append(" ").append(sortDir.equalsIgnoreCase("desc") ? "DESC" : "ASC");
        sql.append(" LIMIT ? OFFSET ?");
        params.add(pageSize);
        params.add(offset);

        List<NewModuleTask> tasks = jdbcTemplate.query(sql.toString(), new NewModuleTaskRowMapper(), params.toArray());

        // Count
        StringBuilder countSql = new StringBuilder("SELECT COUNT(*) FROM newtasks");
        List<Object> countParams = new ArrayList<>();
        if (searchTerm != null && !searchTerm.isEmpty()) {
            countSql.append(" WHERE LOWER(title) LIKE ? OR LOWER(description) LIKE ?");
            countParams.add("%" + searchTerm.toLowerCase() + "%");
            countParams.add("%" + searchTerm.toLowerCase() + "%");
        }

        int totalRecords = jdbcTemplate.queryForObject(countSql.toString(), Integer.class, countParams.toArray());
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
}
