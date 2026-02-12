package com.sahiltech.task.tracker.dto;

import com.sahiltech.task.tracker.model.TaskProjection;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;

public class TaskProjectionMapper implements RowMapper<TaskProjection> {

    @Override
    public TaskProjection mapRow(ResultSet rs, int rowNum) throws SQLException {
        TaskProjection projection = new TaskProjection();
        projection.setId(rs.getLong("id"));
        projection.setTitle(rs.getString("title"));
        projection.setStatus(rs.getString("status"));
         projection.setEmployeeName(rs.getString("employeeName"));  
        projection.setProjectName(rs.getString("projectName"));    
         projection.setEmployeeName(rs.getString("employeeName"));
        projection.setProjectName(rs.getString("projectName"));
 
        projection.setAssignedDate(
                rs.getDate("assigned_date") != null ? rs.getDate("assigned_date").toLocalDate() : null
        );
        projection.setCompletedDate(
                rs.getDate("completed_date") != null ? rs.getDate("completed_date").toLocalDate() : null
        );
        return projection;
     }

     }


