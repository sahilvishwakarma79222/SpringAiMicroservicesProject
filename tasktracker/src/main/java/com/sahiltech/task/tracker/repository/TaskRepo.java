package com.sahiltech.task.tracker.repository;

import com.sahiltech.task.tracker.dto.TaskRoeMapper;
import com.sahiltech.task.tracker.model.Task;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;

@Repository
public class TaskRepo {
    private final JdbcTemplate jdbcTemplate;
    public TaskRepo(JdbcTemplate jdbcTemplate){
        this.jdbcTemplate=jdbcTemplate;
    }

    private String sqlCreate="insert into tasks(title,description,status,project_id,employee_id) values(?,?,?,?,?)";
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
            ps.setString(1,task.getTitle());
            ps.setString(2,task.getDescription());
            ps.setString(3,task.getStatus());
            ps.setLong(4,task.getProjectId());
            ps.setLong(5,task.getEmployeeId());
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



}
