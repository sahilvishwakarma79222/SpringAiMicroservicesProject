package com.sahiltech.task.tracker.dto;

import com.sahiltech.task.tracker.model.Task;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;
<<<<<<< HEAD
import java.time.LocalDate;
=======
>>>>>>> a8c2907b139d5784acf2886000fb6a6fea40ca46

public class TaskRowMapper implements RowMapper<Task> {


    @Override
    public Task mapRow(ResultSet rs, int rowNum) throws SQLException {
        Task task = new Task();
<<<<<<< HEAD
=======

>>>>>>> a8c2907b139d5784acf2886000fb6a6fea40ca46
        task.setId(rs.getLong("id"));
        task.setTitle(rs.getString("title"));
        task.setDescription(rs.getString("description"));
        task.setStatus(rs.getString("status"));
<<<<<<< HEAD
        task.setPriority(rs.getString("priority"));          //  NEW
        task.setProjectId(rs.getLong("project_id"));
        task.setModuleId(rs.getObject("module_id", Long.class)); //  NEW (nullable)
        task.setEmployeeId(rs.getLong("employee_id"));
        task.setErrorId(rs.getLong("error_id"));
        task.setAssignedDate(rs.getObject("assigned_date", LocalDate.class));
        task.setCompletedDate(rs.getObject("completed_date", LocalDate.class));
=======
        task.setPriority(rs.getString("priority"));
        task.setProjectId(rs.getLong("project_id"));

        // module_id and error_id are nullable, so handle with check
        long moduleId = rs.getLong("module_id");
        if (!rs.wasNull()) {
            task.setModuleId(moduleId);
        }

        long errorId = rs.getLong("error_id");
        if (!rs.wasNull()) {
            task.setErrorId(errorId);
        }

        task.setEmployeeId(rs.getLong("employee_id"));

        // handle LocalDate conversion safely
        task.setAssignedDate(
                rs.getDate("assigned_date") != null ? rs.getDate("assigned_date").toLocalDate() : null
        );
        task.setCompletedDate(
                rs.getDate("completed_date") != null ? rs.getDate("completed_date").toLocalDate() : null
        );

>>>>>>> a8c2907b139d5784acf2886000fb6a6fea40ca46
        return task;
    }
}
