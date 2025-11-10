package com.sahiltech.task.tracker.dto;

import com.sahiltech.task.tracker.model.Errors;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class ErrorRowMapper implements RowMapper<Errors> {


    @Override
    public Errors mapRow(ResultSet rs, int rowNum) throws SQLException {
        Errors error=new Errors();
        error.setId(rs.getLong("id"));
        error.setStatus(rs.getString("status"));
        error.setDescription(rs.getString("description"));
        error.setProjectId(rs.getLong("project_id"));
        error.setTitle(rs.getString("title"));
        error.setPriority(rs.getString("priority"));
        error.setClientName((rs.getString("clientname")));

        error.setErrordate(
                rs.getDate("error_date") != null ? rs.getDate("error_date").toLocalDate() : null
        );
        error.setSolved(
                rs.getDate("solved") != null ? rs.getDate("solved").toLocalDate() : null
        );
        return error;
    }
}
