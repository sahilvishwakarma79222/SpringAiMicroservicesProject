package com.sahiltech.task.tracker.repository;

import com.sahiltech.task.tracker.dto.ModuleRowMapper;
import com.sahiltech.task.tracker.model.Module;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.*;

@Repository
public class NewModuleRepo {

    private final JdbcTemplate jdbcTemplate;

    public NewModuleRepo(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // ✅ SQL Queries

    private final String sqlCreate = """
        INSERT INTO modules(name, description, status, priority, client_name, project_id, start_date, completed_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """;

    private final String sqlGetById = "SELECT * FROM modules WHERE id = ?";
    private final String sqlDeleteById = "DELETE FROM modules WHERE id = ?";
    private final String sqlUpdateById = """
        UPDATE modules 
        SET name=?, description=?, status=?, priority=?, client_name=?, project_id=?, start_date=?, completed_date=? 
        WHERE id=?
    """;

    private final String sqlGetAll = "SELECT * FROM modules";
    private final String sqlGetAllCount = "SELECT COUNT(*) FROM modules";
    private static final String SQL_GET_BY_PROJECTID = "SELECT * FROM modules WHERE project_id=?";


    // ✅ GET BY PROJECT ID
    public List<Module> getModuleByProjectId(Long projectId) {
        return jdbcTemplate.query(SQL_GET_BY_PROJECTID, new ModuleRowMapper(), projectId);
    }


    // ✅ CREATE
    public Module saveModule(Module module) {
        if (module == null) return null;

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sqlCreate, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, module.getName());
            ps.setString(2, module.getDescription());
            ps.setString(3, module.getStatus());
            ps.setString(4, module.getPriority());
            ps.setString(5, module.getClientName());
            ps.setObject(6, module.getProjectId());
            ps.setObject(7, module.getStartDate());
            ps.setObject(8, module.getCompletedDate());
            return ps;
        }, keyHolder);

        if (keyHolder.getKey() != null) {
            module.setId(keyHolder.getKey().longValue());
        }

        return module;
    }


    // ✅ READ BY ID
    public Module getById(Long id) {
        if (id == null) return null;
        try {
            return jdbcTemplate.queryForObject(sqlGetById, new ModuleRowMapper(), id);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }


    // ✅ DELETE
    public String deleteModule(Long id) {
        if (id == null) return "Invalid ID";

        int rows = jdbcTemplate.update(sqlDeleteById, id);

        return rows > 0
                ? "Module deleted successfully with id " + id
                : "No module found with id " + id;
    }


    // ✅ UPDATE
    public String updateModule(Long id, Module module) {
        if (id == null || module == null) return "Invalid data";

        int rows = jdbcTemplate.update(sqlUpdateById,
                module.getName(),
                module.getDescription(),
                module.getStatus(),
                module.getPriority(),
                module.getClientName(),
                module.getProjectId(),
                module.getStartDate(),
                module.getCompletedDate(),
                id
        );

        return rows > 0
                ? "Module updated successfully with id " + id
                : "No module found with id " + id;
    }


    // ✅ GET ALL
    public List<Module> getAllModules() {
        return jdbcTemplate.query(sqlGetAll, new ModuleRowMapper());
    }


    // ✅ COUNT
    public int countAllModules() {
        Integer count = jdbcTemplate.queryForObject(sqlGetAllCount, Integer.class);
        return count != null ? count : 0;
    }


    // ✅ SMART PAGINATION
    public Map<String, Object> getModulesSmartPagination(
            Integer pageNumber,
            Integer pageSize,
            String sortBy,
            String sortDir,
            String searchTerm
    ) {

        if (sortBy == null || sortBy.isEmpty()) sortBy = "id";
        if (sortDir == null || sortDir.isEmpty()) sortDir = "asc";
        if (pageNumber == null || pageNumber < 1) pageNumber = 1;
        if (pageSize == null || pageSize < 1) pageSize = 10;

        int offset = (pageNumber - 1) * pageSize;

        StringBuilder sql = new StringBuilder("SELECT * FROM modules");
        List<Object> params = new ArrayList<>();

        // 🔍 Search
        if (searchTerm != null && !searchTerm.isEmpty()) {
            sql.append(" WHERE LOWER(name) LIKE ? OR LOWER(description) LIKE ? OR LOWER(status) LIKE ? OR LOWER(client_name) LIKE ?");
            String like = "%" + searchTerm.toLowerCase() + "%";
            params.add(like);
            params.add(like);
            params.add(like);
            params.add(like);
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

        List<Module> modules =
                jdbcTemplate.query(sql.toString(), new ModuleRowMapper(), params.toArray());

        // 📊 Count
        StringBuilder countSql = new StringBuilder("SELECT COUNT(*) FROM modules");
        List<Object> countParams = new ArrayList<>();

        if (searchTerm != null && !searchTerm.isEmpty()) {
            countSql.append(" WHERE LOWER(name) LIKE ? OR LOWER(description) LIKE ? OR LOWER(status) LIKE ? OR LOWER(client_name) LIKE ?");
            String like = "%" + searchTerm.toLowerCase() + "%";
            countParams.add(like);
            countParams.add(like);
            countParams.add(like);
            countParams.add(like);
        }

        Integer totalRecordsObj =
                jdbcTemplate.queryForObject(countSql.toString(), Integer.class, countParams.toArray());

        int totalRecords = totalRecordsObj != null ? totalRecordsObj : 0;
        int totalPages = (int) Math.ceil((double) totalRecords / pageSize);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("results", modules != null ? modules : Collections.emptyList());
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