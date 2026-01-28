package com.sahiltech.task.tracker.dto;

import com.sahiltech.task.tracker.model.Task;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;

public class TaskRowMapper implements RowMapper<Task> {


    @Override
    public Task mapRow(ResultSet rs, int rowNum) throws SQLException {
        Task task = new Task();
        task.setId(rs.getLong("id"));
        task.setTitle(rs.getString("title"));
        task.setDescription(rs.getString("description"));
        task.setStatus(rs.getString("status"));
        task.setPriority(rs.getString("priority"));          //  NEW
        task.setProjectId(rs.getLong("project_id"));
        task.setModuleId(rs.getObject("module_id", Long.class)); //  NEW (nullable)
        task.setEmployeeId(rs.getLong("employee_id"));
        task.setErrorId(rs.getLong("error_id"));
        task.setAssignedDate(rs.getObject("assigned_date", LocalDate.class));
        task.setCompletedDate(rs.getObject("completed_date", LocalDate.class));
        return task;
    }
}
