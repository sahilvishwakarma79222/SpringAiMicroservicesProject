package com.sahiltech.task.tracker.repository;

import com.sahiltech.task.tracker.dto.ProjectRowMapper;
import com.sahiltech.task.tracker.model.Project;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.*;

@Repository
public class ProjectRepo {

    private final JdbcTemplate jdbcTemplate;

    public ProjectRepo(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // ✅ SQL Statements
    private static final String SQL_INSERT =
            "INSERT INTO projects(name, description, status) VALUES (?, ?, ?)";

    private static final String SQL_FIND_BY_ID =
            "SELECT * FROM projects WHERE id = ?";

    private static final String SQL_DELETE_BY_ID =
            "DELETE FROM projects WHERE id = ?";

    private static final String SQL_UPDATE_BY_ID =
            "UPDATE projects SET name = ?, description = ?, status = ? WHERE id = ?";

    private static final String SQL_FIND_ALL =
            "SELECT * FROM projects";

    private static final String SQL_COUNT_ALL =
            "SELECT COUNT(*) FROM projects";

    private static final String SQL_FIND_ALL_PAGINATED =
            "SELECT * FROM projects LIMIT ? OFFSET ?";


    // ✅ Count all
    public int countAllProjects() {
        Integer count = jdbcTemplate.queryForObject(SQL_COUNT_ALL, Integer.class);
        return count != null ? count : 0;
    }


    // ✅ Create
    public Project saveProject(Project project) {
        if (project == null) return null;

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(SQL_INSERT, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, project.getName());
            ps.setString(2, project.getDescription());
            ps.setString(3, project.getStatus());
            return ps;
        }, keyHolder);

        if (keyHolder.getKey() != null) {
            project.setId(keyHolder.getKey().longValue());
        }

        return project;
    }


    // ✅ Read by ID (null-safe)
    public Project getById(Long id) {
        if (id == null) return null;

        try {
            return jdbcTemplate.queryForObject(SQL_FIND_BY_ID, new ProjectRowMapper(), id);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }


    // ✅ Delete
    public String deleteProject(long id) {
        int rows = jdbcTemplate.update(SQL_DELETE_BY_ID, id);
        return rows > 0
                ? "Project deleted successfully with id " + id
                : "No project found with id " + id;
    }


    // ✅ Update
    public String updateProject(long id, Project project) {
        if (project == null) return "Invalid project data";

        int rows = jdbcTemplate.update(SQL_UPDATE_BY_ID,
                project.getName(),
                project.getDescription(),
                project.getStatus(),
                id
        );

        return rows > 0
                ? "Project updated successfully with id " + id
                : "No project found with id " + id;
    }


    // ✅ Get all
    public List<Project> getAllProjects() {
        return jdbcTemplate.query(SQL_FIND_ALL, new ProjectRowMapper());
    }


    // ✅ Simple Pagination
    public Map<String, Object> getProjectsPage(int pageNumber, int pageSize) {

        if (pageNumber < 1) pageNumber = 1;
        if (pageSize < 1) pageSize = 10;

        int offset = (pageNumber - 1) * pageSize;

        List<Project> projects =
                jdbcTemplate.query(SQL_FIND_ALL_PAGINATED, new ProjectRowMapper(), pageSize, offset);

        int total = countAllProjects();
        int totalPages = (int) Math.ceil((double) total / pageSize);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("projects", projects);
        response.put("total", total);
        response.put("totalPages", totalPages);
        response.put("currentPage", pageNumber);

        return response;
    }


    // ✅ Smart Pagination (Search + Sort)
    public Map<String, Object> getProjectsSmartPagination(
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

        StringBuilder sql = new StringBuilder("SELECT * FROM projects");
        List<Object> params = new ArrayList<>();

        // 🔍 Search
        if (searchTerm != null && !searchTerm.isEmpty()) {
            sql.append(" WHERE LOWER(name) LIKE ? OR LOWER(description) LIKE ? OR LOWER(status) LIKE ?");
            String like = "%" + searchTerm.toLowerCase() + "%";
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

        List<Project> projects =
                jdbcTemplate.query(sql.toString(), new ProjectRowMapper(), params.toArray());

        // 📊 Count Query
        StringBuilder countSql = new StringBuilder("SELECT COUNT(*) FROM projects");
        List<Object> countParams = new ArrayList<>();

        if (searchTerm != null && !searchTerm.isEmpty()) {
            countSql.append(" WHERE LOWER(name) LIKE ? OR LOWER(description) LIKE ? OR LOWER(status) LIKE ?");
            String like = "%" + searchTerm.toLowerCase() + "%";
            countParams.add(like);
            countParams.add(like);
            countParams.add(like);
        }

        Integer totalRecordsObj =
                jdbcTemplate.queryForObject(countSql.toString(), Integer.class, countParams.toArray());

        int totalRecords = totalRecordsObj != null ? totalRecordsObj : 0;
        int totalPages = (int) Math.ceil((double) totalRecords / pageSize);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("results", projects);
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