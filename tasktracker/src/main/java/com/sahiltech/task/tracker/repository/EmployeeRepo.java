package com.sahiltech.task.tracker.repository;

import com.sahiltech.task.tracker.dto.EmployeRowMapper;
import com.sahiltech.task.tracker.dto.ProjectRowMapper;
import com.sahiltech.task.tracker.model.Employee;
import com.sahiltech.task.tracker.model.Project;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

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
    private String sqlGetAllCount = "SELECT count(*) FROM employees";

    public int countAllEmployee(){
        int allEmployeeCount = jdbcTemplate.queryForObject(sqlGetAllCount, Integer.class);
        return allEmployeeCount;
    }

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

    public Map<String, Object> getProjectsSmartPagination(
            int pageNumber,
            int pageSize,
            String sortBy,
            String sortDir,
            String searchTerm
    ) {
        if (sortBy == null || sortBy.isEmpty()) sortBy = "id";
        if (sortDir == null || sortDir.isEmpty()) sortDir = "asc";
        if (pageNumber < 1) pageNumber = 1;
        if (pageSize < 1) pageSize = 10;

        int offset = (pageNumber - 1) * pageSize;

        StringBuilder sql = new StringBuilder("SELECT * FROM employees");
        List<Object> params = new ArrayList<>();

        // Search condition
        if (searchTerm != null && !searchTerm.isEmpty()) {
            sql.append(" WHERE LOWER(name) LIKE ? OR LOWER(email) LIKE ? OR LOWER(department) Like ?");
            params.add("%" + searchTerm.toLowerCase() + "%");
            params.add("%" + searchTerm.toLowerCase() + "%");
            params.add("%" + searchTerm.toLowerCase() + "%");
        }

        //  Sorting
        sql.append(" ORDER BY ").append(sortBy).append(" ").append(sortDir.equalsIgnoreCase("desc") ? "DESC" : "ASC");

        //  Pagination
        sql.append(" LIMIT ? OFFSET ?");
        params.add(pageSize);
        params.add(offset);

        List<Employee> employees = jdbcTemplate.query(sql.toString(), new EmployeRowMapper(), params.toArray());

        //  Count total records for page calculation
        StringBuilder countSql = new StringBuilder("SELECT COUNT(*) FROM employees");
        List<Object> countParams = new ArrayList<>();
        if (searchTerm != null && !searchTerm.isEmpty()) {
            countSql.append(" WHERE LOWER(name) LIKE ? OR LOWER(email) LIKE ? OR LOWER(department) Like ?");
            countParams.add("%" + searchTerm.toLowerCase() + "%");
            countParams.add("%" + searchTerm.toLowerCase() + "%");
            countParams.add("%" + searchTerm.toLowerCase() + "%");

        }

        int totalRecords = jdbcTemplate.queryForObject(countSql.toString(), Integer.class, countParams.toArray());
        int totalPages = (int) Math.ceil((double) totalRecords / pageSize);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("results", employees);
        result.put("totalRecords", totalRecords);
        result.put("totalPages", totalPages);
        result.put("currentPage", pageNumber);
        result.put("pageSize", pageSize);
        result.put("sortBy", sortBy);
        result.put("sortDir", sortDir);
        result.put("searchTerm", searchTerm);

        return result;
    }

}
