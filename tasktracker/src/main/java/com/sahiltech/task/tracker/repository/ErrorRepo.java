package com.sahiltech.task.tracker.repository;

import com.sahiltech.task.tracker.dto.ErrorRowMapper;
import com.sahiltech.task.tracker.dto.ErrorHistory;
import com.sahiltech.task.tracker.dto.ErrorHistoryRowMapper;
import com.sahiltech.task.tracker.model.Errors;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;
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

    private static final String SQL_INSERT = """
        INSERT INTO errors (title, description, status, priority, client_name, project_id, module_id, reported_by, assigned_to, error_date, reopen_count)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """;

    private static final String SQL_INSERT_HISTORY = """
        INSERT INTO error_history (error_id, action, description, changed_by, old_status, new_status)
        VALUES (?, ?, ?, ?, ?, ?)
    """;

    private static final String SQL_GET_BY_ID = "SELECT * FROM errors WHERE id = ?";
    private static final String SQL_GET_HISTORY_BY_ERROR_ID = "SELECT * FROM error_history WHERE error_id = ? ORDER BY changed_at DESC";
    
    private static final String SQL_UPDATE_STATUS = """
        UPDATE errors SET status = ?, solved_date = ?, resolved_by = ? WHERE id = ?
    """;
    
    private static final String SQL_INCREMENT_REOPEN_COUNT = """
        UPDATE errors SET reopen_count = reopen_count + 1, status = ?, assigned_to = ? WHERE id = ?
    """;
    
    private static final String SQL_UPDATE = """
        UPDATE errors SET title = ?, description = ?, status = ?, priority = ?, client_name = ?, 
        project_id = ?, module_id = ?, reported_by = ?, assigned_to = ?, error_date = ?, solved_date = ?
        WHERE id = ?
    """;

    private static final String SQL_GET_ALL = "SELECT * FROM errors";
    private static final String SQL_COUNT_ALL = "SELECT COUNT(*) FROM errors";
    private static final String SQL_DELETE_BY_ID = "DELETE FROM errors WHERE id = ?";
    private static final String SQL_DELETE_HISTORY_BY_ERROR_ID = "DELETE FROM error_history WHERE error_id = ?";

    // CREATE
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
            ps.setObject(7, error.getModuleId());
            ps.setObject(8, error.getReportedBy());
            ps.setObject(9, error.getAssignedTo());
            ps.setObject(10, error.getErrorDate());
            ps.setInt(11, error.getReopenCount() != null ? error.getReopenCount() : 0);
            return ps;
        }, keyHolder);

        if (keyHolder.getKey() != null) {
            error.setId(keyHolder.getKey().longValue());
            addHistory(error.getId(), "CREATED", "Error ticket created", error.getReportedBy(), null, error.getStatus());
        }
        return error;
    }
    
    // Add history entry
    public void addHistory(long errorId, String action, String description, Long changedBy, String oldStatus, String newStatus) {
        jdbcTemplate.update(SQL_INSERT_HISTORY, errorId, action, description, changedBy, oldStatus, newStatus);
    }
    
    // Get history by error ID
    public List<ErrorHistory> getHistoryByErrorId(long errorId) {
        return jdbcTemplate.query(SQL_GET_HISTORY_BY_ERROR_ID, new ErrorHistoryRowMapper(), errorId);
    }
    
    // Get error by ID with history
    public Errors getById(Long id) {
        Errors error = jdbcTemplate.queryForObject(SQL_GET_BY_ID, new ErrorRowMapper(), id);
        if (error != null) {
            List<ErrorHistory> history = getHistoryByErrorId(id);
            error.setHistory(history);
        }
        return error;
    }
    
    // Update status with resolver tracking
    public void updateStatus(long id, String newStatus, Long resolvedBy) {
        java.time.LocalDate solvedDate = "Resolved".equals(newStatus) || "Closed".equals(newStatus) ? 
                                         java.time.LocalDate.now() : null;
        jdbcTemplate.update(SQL_UPDATE_STATUS, newStatus, solvedDate, resolvedBy, id);
    }
    
    // Reopen error
    public void reopenError(long id, Long assignedTo) {
        jdbcTemplate.update(SQL_INCREMENT_REOPEN_COUNT, "Open", assignedTo, id);
    }
    
    // Update full error
    public int updateError(long id, Errors error) {
        return jdbcTemplate.update(SQL_UPDATE,
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
    }
    
    // Delete error and its history
    public int deleteError(long id) {
        jdbcTemplate.update(SQL_DELETE_HISTORY_BY_ERROR_ID, id);
        return jdbcTemplate.update(SQL_DELETE_BY_ID, id);
    }
    
    public List<Errors> getAllErrors() {
        List<Errors> errors = jdbcTemplate.query(SQL_GET_ALL, new ErrorRowMapper());
        for (Errors error : errors) {
            error.setHistory(getHistoryByErrorId(error.getId()));
        }
        return errors;
    }
    
    public int countAllErrors() {
        return jdbcTemplate.queryForObject(SQL_COUNT_ALL, Integer.class);
    }
    
    // SMART PAGINATION
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
            for (int i = 0; i < 5; i++) params.add(like);
        }

        sql.append(" ORDER BY ").append(sortBy).append(" ").append(sortDir.equalsIgnoreCase("desc") ? "DESC" : "ASC");
        sql.append(" LIMIT ? OFFSET ?");
        params.add(pageSize);
        params.add(offset);

        List<Errors> errors = jdbcTemplate.query(sql.toString(), new ErrorRowMapper(), params.toArray());

        // Count total records
        StringBuilder countSql = new StringBuilder("SELECT COUNT(*) FROM errors");
        List<Object> countParams = new ArrayList<>();
        if (searchTerm != null && !searchTerm.isEmpty()) {
            countSql.append(" WHERE LOWER(title) LIKE ? OR LOWER(description) LIKE ? OR LOWER(status) LIKE ? OR LOWER(client_name) LIKE ?");
            String like = "%" + searchTerm.toLowerCase() + "%";
            for (int i = 0; i < 4; i++) countParams.add(like);
        }

        int totalRecords = jdbcTemplate.queryForObject(countSql.toString(), Integer.class, countParams.toArray());
        int totalPages = (int) Math.ceil((double) totalRecords / pageSize);

        // Load history for each error
        for (Errors error : errors) {
            error.setHistory(getHistoryByErrorId(error.getId()));
        }

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