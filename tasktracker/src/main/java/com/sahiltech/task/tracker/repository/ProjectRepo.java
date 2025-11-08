package com.sahiltech.task.tracker.repository;

import com.sahiltech.task.tracker.dto.ProjectRowMapper;
import com.sahiltech.task.tracker.model.Project;
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

public ProjectRepo(JdbcTemplate jdbcTemplate){
    this.jdbcTemplate=jdbcTemplate;
}
    private String sqlCreate="insert into projects(name,description) values(?,?)";
    private String sqlGetById="select * from projects where projects.id=?";
    private String sqlDeleteById="delete from projects where projects.id=?";
    private String sqlUpdateById="update projects set name=?,description=? where id=?";
    private String sqlGetAll = "SELECT * FROM projects";
    private String sqlGetAllPaginated = "SELECT * FROM projects LIMIT ? OFFSET ?";

    public Project saveProject(Project project){
        KeyHolder keyHolder=new GeneratedKeyHolder();

        jdbcTemplate.update(connection->{
            PreparedStatement ps = connection.prepareStatement(sqlCreate, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, project.getName());
            ps.setString(2, project.getDescription());
            return ps;
    },keyHolder);
        if(keyHolder!=null){
            project.setId(keyHolder.getKey().longValue());
        }
        return project;
    }



    public Project getById(Long id){
        Project project = jdbcTemplate.queryForObject(sqlGetById, new ProjectRowMapper(), id);
        return project;
    }

    public String deleteProject(long id){
        jdbcTemplate.update(sqlDeleteById,id);
        return "project deleted succesfully with id "+id;
    }

    public String updateProject(long id,Project project){
        jdbcTemplate.update(sqlUpdateById,
                project.getName(),
                project.getDescription(),
                id
                );
        return "Project deleted succesfully with id "+id;
    }

    public List<Project> getAllProjects(){
        List<Project> projects = jdbcTemplate.query(sqlGetAll, new ProjectRowMapper());
        return projects;
    }

    public Map<String, Object> getProjectsPage(int pageNumber, int pageSize) {
        int offset = (pageNumber - 1) * pageSize;


        List<Project> projects = jdbcTemplate.query(sqlGetAllPaginated, new ProjectRowMapper(), pageSize, offset);

        int total = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM projects", Integer.class);
        int totalPages = (int) Math.ceil((double) total / pageSize);

        Map<String, Object> response = new HashMap<>();
        response.put("projects", projects);
        response.put("total", total);
        response.put("totalPages", totalPages);
        response.put("currentPage", pageNumber);

        return response;
    }

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

        // ✅ Search condition
        if (searchTerm != null && !searchTerm.isEmpty()) {
            sql.append(" WHERE LOWER(name) LIKE ? OR LOWER(description) LIKE ?");
            params.add("%" + searchTerm.toLowerCase() + "%");
            params.add("%" + searchTerm.toLowerCase() + "%");
        }

        // ✅ Sorting
        sql.append(" ORDER BY ").append(sortBy).append(" ").append(sortDir.equalsIgnoreCase("desc") ? "DESC" : "ASC");

        // ✅ Pagination
        sql.append(" LIMIT ? OFFSET ?");
        params.add(pageSize);
        params.add(offset);

        List<Project> projects = jdbcTemplate.query(sql.toString(), new ProjectRowMapper(), params.toArray());

        // ✅ Count total records for page calculation
        StringBuilder countSql = new StringBuilder("SELECT COUNT(*) FROM projects");
        List<Object> countParams = new ArrayList<>();
        if (searchTerm != null && !searchTerm.isEmpty()) {
            countSql.append(" WHERE LOWER(name) LIKE ? OR LOWER(description) LIKE ?");
            countParams.add("%" + searchTerm.toLowerCase() + "%");
            countParams.add("%" + searchTerm.toLowerCase() + "%");
        }

        int totalRecords = jdbcTemplate.queryForObject(countSql.toString(), Integer.class, countParams.toArray());
        int totalPages = (int) Math.ceil((double) totalRecords / pageSize);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("projects", projects);
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
