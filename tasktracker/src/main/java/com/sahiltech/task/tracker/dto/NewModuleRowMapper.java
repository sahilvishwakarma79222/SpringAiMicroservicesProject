package com.sahiltech.task.tracker.dto;

import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class NewModuleRowMapper implements RowMapper<com.sahiltech.task.tracker.model.Module> {


    @Override
    public com.sahiltech.task.tracker.model.Module mapRow(ResultSet rs, int rowNum) throws SQLException {
    	com.sahiltech.task.tracker.model.Module module = new com.sahiltech.task.tracker.model.Module();
        module.setId(rs.getLong("id"));
        module.setName(rs.getString("name"));
        module.setDescription(rs.getString("description"));
        module.setStatus(rs.getString("status"));
        module.setPriority(rs.getString("priority"));
        module.setClientName(rs.getString("client_name"));
        module.setProjectId(rs.getLong("project_id"));
        module.setStartDate(rs.getDate("start_date") != null ? rs.getDate("start_date").toLocalDate() : null);
        module.setCompletedDate(rs.getDate("completed_date") != null ? rs.getDate("completed_date").toLocalDate() : null);
        return module;
    }
}
