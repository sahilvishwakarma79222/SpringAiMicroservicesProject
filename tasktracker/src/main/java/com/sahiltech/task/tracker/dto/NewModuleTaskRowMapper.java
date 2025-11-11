package com.sahiltech.task.tracker.dto;

import com.sahiltech.task.tracker.model.NewModuleTask;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class NewModuleTaskRowMapper implements RowMapper<NewModuleTask> {


    @Override
    public NewModuleTask mapRow(ResultSet rs, int rowNum) throws SQLException {
        NewModuleTask newTask=new NewModuleTask();
        newTask.setId(rs.getLong("id"));
        newTask.setTitle(rs.getString("title"));
        newTask.setDescription(rs.getString("description"));
        newTask.setStatus(rs.getString("status"));
        newTask.setProjectid(rs.getLong("project_id"));
        newTask.setEmployeeid(rs.getLong("employee_id"));
        newTask.setAssigneddate(
                rs.getDate("assigned_date") != null ? rs.getDate("assigned_date").toLocalDate() : null
        );
        newTask.setCompleteddate(
                rs.getDate("completed_date") != null ? rs.getDate("completed_date").toLocalDate() : null
        );
        return newTask;
    }
}
