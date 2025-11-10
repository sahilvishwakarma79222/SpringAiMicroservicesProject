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
    public ErrorRepo(JdbcTemplate jdbcTemplate){
        this.jdbcTemplate=jdbcTemplate;
    }

    private String sqlCreate="insert into errors(title,description,status,project_id,error_date,solved,priority,clientname) values(?,?,?,?,?,?,?,?)";
    private String sqlGetById="select * from errors where errors.id=?";
    private String sqlDeleteById="delete from errors where errors.id=?";
    private String sqlUpdateById="update errors set title=?,description=?,status=?,project_id=?," +
            " error_date=?,solved=?,priority=?,clientname=? where id=?";
    private String sqlGetAll = "SELECT * FROM errors";
    private String sqlGetAllCount = "SELECT count(*) FROM errors";

    // ✅ CREATE
    public Errors saveError(Errors error) {
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sqlCreate, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, error.getTitle());
            ps.setString(2, error.getDescription());
            ps.setString(3, error.getStatus());
            ps.setLong(4, error.getProjectId());
            ps.setObject(5, error.getErrordate());
            ps.setObject(6, error.getSolved());
            ps.setString(7, error.getPriority());
            ps.setString(8, error.getClientName());
            return ps;
        }, keyHolder);

        if (keyHolder.getKey() != null) {
            error.setId(keyHolder.getKey().longValue());
        }
        return error;
    }


    // ✅ READ (by ID)
    public Errors getById(Long id) {
        return jdbcTemplate.queryForObject(sqlGetById, new ErrorRowMapper(), id);
    }


    // ✅ DELETE
    public String deleteError(long id) {
        jdbcTemplate.update(sqlDeleteById, id);
        return "Error deleted successfully with id " + id;
    }


    // ✅ UPDATE
    public String updateError(long id, Errors error) {
        jdbcTemplate.update(sqlUpdateById,
                error.getTitle(),
                error.getDescription(),
                error.getStatus(),
                error.getProjectId(),
                error.getErrordate(),
                error.getSolved(),
                error.getPriority(),
                error.getClientName(),
                id
        );
        return "Error updated successfully with id " + id;
    }


    // ✅ GET ALL
    public List<Errors> getAllErrors() {
        return jdbcTemplate.query(sqlGetAll, new ErrorRowMapper());
    }


    // ✅ COUNT ALL
    public int countAllErrors() {
        return jdbcTemplate.queryForObject(sqlGetAllCount, Integer.class);
    }


    // ✅ SMART PAGINATION + SEARCH + SORT
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

        // ✅ Search condition
        if (searchTerm != null && !searchTerm.isEmpty()) {
            sql.append(" WHERE LOWER(title) LIKE ? OR LOWER(description) LIKE ? OR LOWER(status) LIKE ? OR LOWER(client_name) LIKE ?");
            String like = "%" + searchTerm.toLowerCase() + "%";
            params.add(like);
            params.add(like);
            params.add(like);
            params.add(like);
        }

        // ✅ Sorting
        sql.append(" ORDER BY ").append(sortBy).append(" ").append(sortDir.equalsIgnoreCase("desc") ? "DESC" : "ASC");

        // ✅ Pagination
        sql.append(" LIMIT ? OFFSET ?");
        params.add(pageSize);
        params.add(offset);

        List<Errors> errors = jdbcTemplate.query(sql.toString(), new ErrorRowMapper(), params.toArray());

        // ✅ Count total records
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
