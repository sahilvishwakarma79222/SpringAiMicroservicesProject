package com.sahiltech.task.tracker.dto;

import com.sahiltech.task.tracker.model.Project;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class ProjectRowMapper implements RowMapper<Project> {

    @Override
    public Project mapRow(ResultSet rs, int rowNum) throws SQLException {
        Project project=new Project();
        project.setName(rs.getString("name"));
        project.setDescription(rs.getString("description"));
        project.setId(rs.getLong("id"));
<<<<<<< HEAD
        project.setStatus(rs.getString("status"));
=======
        project.setStatus(rs.getString("status")); // Make sure this line exists

>>>>>>> a8c2907b139d5784acf2886000fb6a6fea40ca46
        return project;
    }
}
