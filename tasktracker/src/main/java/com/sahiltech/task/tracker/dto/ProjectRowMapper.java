package com.sahiltech.task.tracker.dto;

import com.sahiltech.task.tracker.model.Project;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class ProjectRowMapper implements RowMapper<Project> {
	
	   @Override
	    public Project mapRow(ResultSet rs, int rowNum) throws SQLException {
	        Project project = new Project();
	        project.setId(rs.getLong("id"));
	        project.setName(rs.getString("name"));
	        project.setDescription(rs.getString("description"));
	        project.setStatus(rs.getString("status"));
	        project.setProjecthead(rs.getString("projecthead"));
	        project.setProjectmanager(rs.getString("projectmanager"));
	        // Handle dates - agar null ho to null hi rahega
	        project.setStartDate(rs.getDate("start_date"));
	        project.setEndDate(rs.getDate("end_date"));
	        
	        return project;
	    }
	}
