package com.sahiltech.task.tracker.dto;

import com.sahiltech.task.tracker.model.Errors;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class ErrorRowMapper implements RowMapper<Errors> {


    @Override
    public Errors mapRow(ResultSet rs, int rowNum) throws SQLException {
        Errors error = new Errors();
        error.setId(rs.getLong("id"));
        error.setTitle(rs.getString("title"));
        error.setDescription(rs.getString("description"));
        error.setStatus(rs.getString("status"));
        error.setPriority(rs.getString("priority"));
        error.setClientName(rs.getString("client_name"));
        error.setProjectId(rs.getLong("project_id"));
        error.setModuleId(rs.getObject("module_id") != null ? rs.getLong("module_id") : null);
        error.setReportedBy(rs.getObject("reported_by") != null ? rs.getLong("reported_by") : null);
        error.setAssignedTo(rs.getObject("assigned_to") != null ? rs.getLong("assigned_to") : null);
         error.setErrorDate(rs.getDate("error_date") != null ? rs.getDate("error_date").toLocalDate() : null);
        error.setSolvedDate(rs.getDate("solved_date") != null ? rs.getDate("solved_date").toLocalDate() : null);
        return error;

    }
}
