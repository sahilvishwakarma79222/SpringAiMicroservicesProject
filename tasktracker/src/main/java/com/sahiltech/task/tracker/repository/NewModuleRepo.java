package com.sahiltech.task.tracker.repository;

import com.sahiltech.task.tracker.dto.NewModuleRowMapper;
import com.sahiltech.task.tracker.model.NewModule;
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
public class NewModuleRepo {

    private final JdbcTemplate jdbcTemplate;

    public NewModuleRepo(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // 🔹 SQL Queries
    private final String sqlCreate = "INSERT INTO newmodule(modulename, description, priority, status, clientName,project_id, moduledate) VALUES (?, ?,?, ?, ?, ?, ?)";
    private final String sqlGetById = "SELECT * FROM newmodule WHERE id = ?";
    private final String sqlDeleteById = "DELETE FROM newmodule WHERE id = ?";
    private final String sqlUpdateById = "UPDATE newmodule SET modulename=?, description=?, priority=?, status=?, clientname=?, moduledate=? ,project_id=? WHERE id=?";
    private final String sqlGetAll = "SELECT * FROM newmodule";
    private final String sqlGetAllCount = "SELECT COUNT(*) FROM newmodule";


     public NewModule saveModule(NewModule module) {
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sqlCreate, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, module.getModulename());
            ps.setString(2, module.getDescription());
            ps.setString(3, module.getPriority());
            ps.setString(4, module.getStatus());
            ps.setString(5, module.getClientName());
            ps.setLong(6,module.getProject_id());
            ps.setObject(7, module.getModuledate());

            return ps;
        }, keyHolder);

        if (keyHolder.getKey() != null) {
            module.setId(keyHolder.getKey().longValue());
        }
        return module;
    }


     public NewModule getById(Long id) {
        return jdbcTemplate.queryForObject(sqlGetById, new NewModuleRowMapper(), id);
    }


     public String deleteModule(long id) {
        jdbcTemplate.update(sqlDeleteById, id);
        return "Module deleted successfully with id " + id;
    }


    // ✅ UPDATE
    public String updateModule(long id, NewModule module) {
        jdbcTemplate.update(sqlUpdateById,
                module.getModulename(),
                module.getDescription(),
                module.getPriority(),
                module.getStatus(),
                module.getClientName(),
                module.getModuledate(),
                module.getProject_id(),
                id
        );
        return "Module updated successfully with id " + id;
    }


    // ✅ GET ALL
    public List<NewModule> getAllModules() {
        return jdbcTemplate.query(sqlGetAll, new NewModuleRowMapper());
    }


    // ✅ COUNT ALL
    public int countAllModules() {
        return jdbcTemplate.queryForObject(sqlGetAllCount, Integer.class);
    }


    // ✅ SMART PAGINATION + SEARCH + SORT
    public Map<String, Object> getModulesSmartPagination(
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

        StringBuilder sql = new StringBuilder("SELECT * FROM new_module");
        List<Object> params = new ArrayList<>();

        // ✅ Search condition
        if (searchTerm != null && !searchTerm.isEmpty()) {
            sql.append(" WHERE LOWER(modulename) LIKE ? OR LOWER(description) LIKE ? OR LOWER(status) LIKE ? OR LOWER(clientname) LIKE ?");
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

        List<NewModule> modules = jdbcTemplate.query(sql.toString(), new NewModuleRowMapper(), params.toArray());

        // ✅ Count total records
        StringBuilder countSql = new StringBuilder("SELECT COUNT(*) FROM new_module");
        List<Object> countParams = new ArrayList<>();
        if (searchTerm != null && !searchTerm.isEmpty()) {
            countSql.append(" WHERE LOWER(modulename) LIKE ? OR LOWER(description) LIKE ? OR LOWER(status) LIKE ? OR LOWER(clientname) LIKE ?");
            String like = "%" + searchTerm.toLowerCase() + "%";
            countParams.add(like);
            countParams.add(like);
            countParams.add(like);
            countParams.add(like);
        }

        int totalRecords = jdbcTemplate.queryForObject(countSql.toString(), Integer.class, countParams.toArray());
        int totalPages = (int) Math.ceil((double) totalRecords / pageSize);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("results", modules);
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
