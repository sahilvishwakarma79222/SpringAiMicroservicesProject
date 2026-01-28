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
<<<<<<< HEAD
        projection.setEmployeeName(rs.getString("employeeName")); // ✅ correct alias
        projection.setProjectName(rs.getString("projectName"));   // ✅ correct alias
=======
        projection.setEmployeeName(rs.getString("employeeName"));
        projection.setProjectName(rs.getString("projectName"));
>>>>>>> a8c2907b139d5784acf2886000fb6a6fea40ca46

        projection.setAssignedDate(
                rs.getDate("assigned_date") != null ? rs.getDate("assigned_date").toLocalDate() : null
        );
        projection.setCompletedDate(
                rs.getDate("completed_date") != null ? rs.getDate("completed_date").toLocalDate() : null
        );
        return projection;
<<<<<<< HEAD
=======
    }

>>>>>>> a8c2907b139d5784acf2886000fb6a6fea40ca46
    }


