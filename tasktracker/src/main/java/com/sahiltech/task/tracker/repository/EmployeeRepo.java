package com.sahiltech.task.tracker.repository;

import com.sahiltech.task.tracker.model.Employee;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;

@Repository
public class EmployeeRepo {

    private final JdbcTemplate jdbcTemplate;

    public EmployeeRepo(JdbcTemplate jdbcTemplate){
        this.jdbcTemplate=jdbcTemplate;
    }

    private String sqlCreate="insert into employees(name,email,department) values(?,?,?)";
    public Employee save(Employee employee){
        KeyHolder keyHolder=new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sqlCreate, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, employee.getName());
            ps.setString(2, employee.getEmail());
            ps.setString(3, employee.getDepartment());
            return ps;
        },keyHolder);
        Number key=keyHolder.getKey();
        if(key!=null){
            employee.setId(key.longValue());

        }
//        int update = jdbcTemplate.update(sqlCreate, employee.getName(), employee.getEmail(), employee.getDepartment());

        return employee;
    }
}
