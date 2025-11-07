package com.sahiltech.task.tracker.repository;

import com.sahiltech.task.tracker.dto.ProjectRowMapper;
import com.sahiltech.task.tracker.model.Project;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;

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


}
