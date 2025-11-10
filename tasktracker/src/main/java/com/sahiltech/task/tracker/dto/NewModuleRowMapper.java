package com.sahiltech.task.tracker.dto;

import com.sahiltech.task.tracker.model.Errors;
import com.sahiltech.task.tracker.model.NewModule;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class NewModuleRowMapper implements RowMapper<NewModule> {


    @Override
    public NewModule mapRow(ResultSet rs, int rowNum) throws SQLException {
        NewModule module=new NewModule();
        module.setId(rs.getLong("id"));
        module.setDescription(rs.getString("description"));
        module.setPriority(rs.getString("priority"));
        module.setModulename(rs.getString("modulename"));
        module.setStatus(rs.getString("status"));
        module.setClientName(rs.getString("clientname"));
        module.setProject_id(rs.getLong("project_id"));
        module.setModuledate(
                rs.getDate("moduledate") != null ? rs.getDate("moduledate").toLocalDate() : null
        );
        return module;
    }
}
