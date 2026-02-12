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
         project.setStatus(rs.getString("status"));
 
         return project;
    }
}
