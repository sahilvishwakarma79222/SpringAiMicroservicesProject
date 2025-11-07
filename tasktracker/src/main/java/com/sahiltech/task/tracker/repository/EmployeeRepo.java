package com.sahiltech.task.tracker.repository;

import com.sahiltech.task.tracker.dto.EmployeRowMapper;
import com.sahiltech.task.tracker.model.Employee;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;

@Repository
public class EmployeeRepo {

    private final JdbcTemplate jdbcTemplate;

    public EmployeeRepo(JdbcTemplate jdbcTemplate){
        this.jdbcTemplate=jdbcTemplate;
    }

    private String sqlCreate="insert into employees(name,email,department) values(?,?,?)";
    private String sqlGetById="select * from employees where employees.id=?";
    private String sqlDeleteById="delete from employees where employees.id=?";
    private String sqlUpdateById="update employees set name=?,email=?,department=? where id=?";
    private String sqlGetAll = "SELECT * FROM employees";

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



    public Employee getById(Long id) {
        return jdbcTemplate.queryForObject(sqlGetById, new EmployeRowMapper(), id);
    }

    public String deleteEmployee(long id){
        jdbcTemplate.update(sqlDeleteById,id);
        return "employee deleted Succesfully";
    }

    public String updateEmployee(long id,Employee employee){
        int update = jdbcTemplate.update(sqlUpdateById,
                employee.getName(),
                employee.getEmail(),
                employee.getDepartment(), id
        );
        return "Succesfully updated the employee with id "+id;
    }

    public List<Employee> getAll() {
        return jdbcTemplate.query(sqlGetAll, new EmployeRowMapper());
    }

}
