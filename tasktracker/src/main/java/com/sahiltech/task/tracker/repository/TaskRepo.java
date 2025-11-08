package com.sahiltech.task.tracker.repository;

import com.sahiltech.task.tracker.dto.EmployeRowMapper;
import com.sahiltech.task.tracker.dto.TaskProjectionMapper;
import com.sahiltech.task.tracker.dto.TaskRoeMapper;
import com.sahiltech.task.tracker.model.Employee;
import com.sahiltech.task.tracker.model.Task;
import com.sahiltech.task.tracker.model.TaskProjection;
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
public class TaskRepo {
    private final JdbcTemplate jdbcTemplate;
    public TaskRepo(JdbcTemplate jdbcTemplate){
        this.jdbcTemplate=jdbcTemplate;
    }

//    private String sqlCreate="insert into tasks(title,description,status,project_id,employee_id) values(?,?,?,?,?)";
private String sqlCreate = "INSERT INTO tasks (title, description, status, project_id, employee_id, assigned_date, completed_date) VALUES (?, ?, ?, ?, ?, ?, ?)";

    private String sqlGetById="select * from tasks where tasks.id=?";
    private String sqlDeleteById="delete from tasks where tasks.id=?";
    private String sqlUpdateById="update tasks set title=?,description=?,status=?,project_id=?,employee_id=? where id=?";
    private String sqlGetAll = "SELECT * FROM tasks";
    private String sqlGetByProjectId="select * from tasks where tasks.project_id=?";
    private String sqlGetByEmployeeId="select * from tasks where tasks.employee_id=?";


    public Task saveTask(Task task){
        KeyHolder keyHolder=new GeneratedKeyHolder();
        jdbcTemplate.update(connection->{
            PreparedStatement ps=connection.prepareStatement(sqlCreate, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, task.getTitle());
            ps.setString(2, task.getDescription());
            ps.setString(3, task.getStatus());
            ps.setObject(4, task.getProjectId());
            ps.setObject(5, task.getEmployeeId());
            ps.setObject(6, task.getAssignedDate());   // ✅ LocalDate -> SQL DATE handled automatically
            ps.setObject(7, task.getCompletedDate());  // ✅ same here
            return ps;
        },keyHolder);
        Number key = keyHolder.getKey();
        if(key!=null){
            task.setId(key.longValue());
        }
        return task;
    }

    public Task getById(Long id){
        Task task = jdbcTemplate.queryForObject(sqlGetById, new TaskRoeMapper(), id);
        return task;
    }

    public Task getByEmployeeId(Long id){
        Task task = jdbcTemplate.queryForObject(sqlGetByEmployeeId, new TaskRoeMapper(), id);
        return task;
    }

    public Task getByProjectId(Long id){
        Task task = jdbcTemplate.queryForObject(sqlGetByProjectId, new TaskRoeMapper(), id);
        return task;
    }

    public List<Task> getAllTask(){
        List<Task> tasks = jdbcTemplate.query(sqlGetAll, new TaskRoeMapper());
        return tasks;
    }
    public String updateTask(Long id,Task task){
        int update = jdbcTemplate.update(sqlUpdateById,
                task.getTitle(),
                task.getDescription(),
                task.getStatus(),
                task.getProjectId(),
                task.getEmployeeId(),
                id);
        return "Task Updated Succesfully with id "+id;
    }

    public String deleteTask(Long id){
        int update = jdbcTemplate.update(sqlGetById, id);
        return "task deleted succesfully with id "+id ;
    }

    public Map<String, Object> getProjectsSmartPagination(
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

        StringBuilder sql = new StringBuilder("SELECT t.id, t.title, t.status,t.assigned_date,t.completed_date, e.name , p.name AS projectName ");
        sql.append(baseQuery);
        List<Object> params = new ArrayList<>();

        // ✅ Search condition
        if (searchTerm != null && !searchTerm.isEmpty()) {
            sql.append(" WHERE LOWER(t.title) LIKE ? OR LOWER(t.status) LIKE ? OR LOWER(e.name) LIKE ? OR LOWER(p.name) LIKE ? OR t.assigned_date LIKE ? OR t.completed_date LIKE ?");
            String search = "%" + searchTerm.toLowerCase() + "%";
            params.add(search);
            params.add(search);
            params.add(search);
            params.add(search);
        }

        // ✅ Sorting
        sql.append(" ORDER BY ").append(sortBy).append(" ").append(sortDir.equalsIgnoreCase("desc") ? "DESC" : "ASC");

        // ✅ Pagination
        sql.append(" LIMIT ? OFFSET ?");
        params.add(pageSize);
        params.add(offset);

        // ✅ Execute query with your custom RowMapper
        List<TaskProjection> tasks = jdbcTemplate.query(sql.toString(), new TaskProjectionMapper(), params.toArray());

        // ✅ Count total records
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

        // ✅ Prepare result
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
