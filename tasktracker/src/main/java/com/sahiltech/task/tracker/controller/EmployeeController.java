package com.sahiltech.task.tracker.controller;

import com.sahiltech.task.tracker.model.Employee;
import com.sahiltech.task.tracker.serviceimpl.EmployeeServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/employee")
public class EmployeeController {


    private final EmployeeServiceImpl service;

    public EmployeeController(EmployeeServiceImpl service){
        this.service=service;
    }

    @PostMapping("/save")
    public ResponseEntity<Employee> saveEmployee(@RequestBody Employee employee){
        Employee employee1 = service.saveEmployee(employee);
        return new ResponseEntity<>(employee, HttpStatus.OK);
    }

    @GetMapping("/getEmployee/{id}")
    public ResponseEntity<Employee> saveEmployee(@PathVariable Long id){
        Employee employee = service.getById(id);
        return new ResponseEntity<>(employee, HttpStatus.OK);
    }

    @PutMapping("/updateEmployee/{id}")
    public ResponseEntity<String> saveEmployee(@PathVariable long id,@RequestBody Employee employee){
        String msg = service.updateEmployee(id, employee);
        return new ResponseEntity<>(msg, HttpStatus.OK);
    }

    @GetMapping("/allEmployee")
    public ResponseEntity<List<Employee>> getAllEmployee(){
        List<Employee> allEmployee = service.getAllEmployee();
        return new ResponseEntity<>(allEmployee,HttpStatus.OK);
    }
}
