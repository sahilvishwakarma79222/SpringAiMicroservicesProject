package com.sahiltech.task.tracker.repository;

import com.sahiltech.task.tracker.dto.ErrorRowMapper;
import com.sahiltech.task.tracker.model.Errors;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RequestBody;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Repository
public class ErrorRepo {
    private final JdbcTemplate jdbcTemplate;

    public ErrorRepo(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    //  INSERt ka  Query (updated)
    private static final String SQL_INSERT = """
        INSERT INTO errors (title, description, status, priority, client_name, project_id, module_id, reported_by, assigned_to, error_date, solved_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """;

    private static final String SQL_GET_BY_ID = "SELECT * FROM errors WHERE id = ?";
    private static final String SQL_DELETE_BY_ID = "DELETE FROM errors WHERE id = ?";
 
  
    //  UPDATE Query (updated)
    private static final String SQL_UPDATE_BY_ID = """
        UPDATE errors
        SET title = ?, description = ?, status = ?, priority = ?, client_name = ?, project_id = ?, module_id = ?, reported_by = ?, assigned_to = ?, error_date = ?, solved_date = ?
        WHERE id = ?
    """;

    private static final String SQL_GET_ALL = "SELECT * FROM errors";
    private static final String SQL_COUNT_ALL = "SELECT COUNT(*) FROM errors";

    //  CREATE
    public Errors saveError(Errors error) {
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(SQL_INSERT, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, error.getTitle());
            ps.setString(2, error.getDescription());
            ps.setString(3, error.getStatus());
            ps.setString(4, error.getPriority());
            ps.setString(5, error.getClientName());
            ps.setLong(6, error.getProjectId());
            ps.setObject(7, error.getErrorDate());
            ps.setObject(8, error.getSolvedDate());
            ps.setObject(7, error.getModuleId());
            ps.setObject(8, error.getReportedBy());
            ps.setObject(9, error.getAssignedTo());
            ps.setObject(10, error.getErrorDate());
            ps.setObject(11, error.getSolvedDate());
            return ps;
        }, keyHolder);

        if (keyHolder.getKey() != null) {
            error.setId(keyHolder.getKey().longValue());
        }
        return error;
    }


    //  READ BY ID
    public Errors getById(Long id) {
        return jdbcTemplate.queryForObject(SQL_GET_BY_ID, new ErrorRowMapper(), id);
    }


    //  UPDATE
    public String updateError(long id, Errors error) {
        jdbcTemplate.update(SQL_UPDATE_BY_ID,
                error.getTitle(),
                error.getDescription(),
                error.getStatus(),
                error.getPriority(),
                error.getClientName(),
                error.getProjectId(),

                error.getModuleId(),
                error.getReportedBy(),
                error.getAssignedTo(),
                error.getErrorDate(),
                error.getSolvedDate(),
                id
        );
        return "Error updated successfully with id " + id;
    }


    //  DELETE
    public String deleteError(long id) {
        jdbcTemplate.update(SQL_DELETE_BY_ID, id);
        return "Error deleted successfully with id " + id;
    }


    //  GET ALL
    public List<Errors> getAllErrors() {
        return jdbcTemplate.query(SQL_GET_ALL, new ErrorRowMapper());
    }

    //  COUNT
    public int countAllErrors() {
        return jdbcTemplate.queryForObject(SQL_COUNT_ALL, Integer.class);
    }

    //  SMART PAGINATION
    public Map<String, Object> getErrorsSmartPagination(
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
        StringBuilder sql = new StringBuilder("SELECT * FROM errors");
        List<Object> params = new ArrayList<>();

        if (searchTerm != null && !searchTerm.isEmpty()) {
            sql.append(" WHERE LOWER(title) LIKE ? OR LOWER(priority) LIKE ? OR LOWER(description) LIKE ? OR LOWER(status) LIKE ? OR LOWER(client_name) LIKE ?");
            String like = "%" + searchTerm.toLowerCase() + "%";
            params.add(like);
            params.add(like);
            params.add(like);
            params.add(like);
        }

        sql.append(" ORDER BY ").append(sortBy).append(" ").append(sortDir.equalsIgnoreCase("desc") ? "DESC" : "ASC");
        sql.append(" LIMIT ? OFFSET ?");
        params.add(pageSize);
        params.add(offset);

        List<Errors> errors = jdbcTemplate.query(sql.toString(), new ErrorRowMapper(), params.toArray());

        //  Count total records
        StringBuilder countSql = new StringBuilder("SELECT COUNT(*) FROM errors");
        List<Object> countParams = new ArrayList<>();
        if (searchTerm != null && !searchTerm.isEmpty()) {
            countSql.append(" WHERE LOWER(title) LIKE ? OR LOWER(description) LIKE ? OR LOWER(status) LIKE ? OR LOWER(client_name) LIKE ?");
            String like = "%" + searchTerm.toLowerCase() + "%";
            countParams.add(like);
            countParams.add(like);
            countParams.add(like);
            countParams.add(like);
        }

        int totalRecords = jdbcTemplate.queryForObject(countSql.toString(), Integer.class, countParams.toArray());
        int totalPages = (int) Math.ceil((double) totalRecords / pageSize);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("results", errors);
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
