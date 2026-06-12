package com.sahiltech.task.tracker.dto;

import org.springframework.jdbc.core.RowMapper;
import java.sql.ResultSet;
import java.sql.SQLException;

public class ErrorHistoryRowMapper implements RowMapper<ErrorHistory> {
    
    @Override
    public ErrorHistory mapRow(ResultSet rs, int rowNum) throws SQLException {
        ErrorHistory history = new ErrorHistory();
        history.setId(rs.getLong("id"));
        history.setErrorId(rs.getLong("error_id"));
        history.setAction(rs.getString("action"));
        history.setDescription(rs.getString("description"));
        history.setChangedBy(rs.getObject("changed_by") != null ? rs.getLong("changed_by") : null);
        history.setChangedAt(rs.getTimestamp("changed_at") != null ? rs.getTimestamp("changed_at").toLocalDateTime() : null);
        history.setOldStatus(rs.getString("old_status"));
        history.setNewStatus(rs.getString("new_status"));
        return history;
    }
}