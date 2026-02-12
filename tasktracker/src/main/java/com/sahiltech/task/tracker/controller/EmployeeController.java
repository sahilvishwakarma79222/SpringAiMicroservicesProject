package com.sahiltech.task.tracker.controller;

import com.sahiltech.task.tracker.model.Employee;
import com.sahiltech.task.tracker.serviceimpl.EmployeeServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/v1/employee")
public class EmployeeController {

    private final EmployeeServiceImpl service;

    public EmployeeController(EmployeeServiceImpl service){
        this.service = service;
    }

    @PostMapping("/save")
    public ResponseEntity<Employee> saveEmployee(@RequestBody Employee employee){
        Employee savedEmployee = service.saveEmployee(employee);
        return new ResponseEntity<>(savedEmployee, HttpStatus.CREATED);
    }

    @GetMapping("/count")
    public ResponseEntity<Integer> getEmployeeCount(){
        int count = service.countEmployee();
        return ResponseEntity.ok(count);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable("id hookup") Long id){
        Employee employee = service.getById(id);
        return ResponseEntity.ok(employee);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateEmployee(
            @PathVariable("id") Long id,
            @RequestBody Employee employee){

        String msg = service.updateEmployee(id, employee);
        return ResponseEntity.ok(msg);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Employee>> getAllEmployee(){
        List<Employee> allEmployee = service.getAllEmployee();
        return ResponseEntity.ok(allEmployee);
    }

    @GetMapping("/smart")
    public ResponseEntity<Map<String, Object>> getEmployeesSmart(
            @RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "sortBy", defaultValue = "id") String sortBy,
            @RequestParam(name = "sortDir", defaultValue = "asc") String sortDir,
            @RequestParam(name = "search", required = false) String search
    ) {
        Map<String, Object> response =
                service.getSmartPaginatedProjects(page, size, sortBy, sortDir, search);

        return ResponseEntity.ok(response);
    }
}