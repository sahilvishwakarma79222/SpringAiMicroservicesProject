package com.sahiltech.task.tracker.dto;

import com.sahiltech.task.tracker.model.Task;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class TaskRoeMapper implements RowMapper<Task> {


    @Override
    public Task mapRow(ResultSet rs, int rowNum) throws SQLException {
        Task task=new Task();
        task.setId(rs.getLong("id"));
        task.setTitle(rs.getString("title"));
        task.setDescription(rs.getString("description"));
        task.setStatus(rs.getString("status"));
        task.setProjectId(rs.getLong("project_id"));
        task.setEmployeeId(rs.getLong("employee_id"));
        return task;
    }
}
