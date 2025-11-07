package com.sahiltech.task.tracker.controller;

import com.sahiltech.task.tracker.model.Employee;
import com.sahiltech.task.tracker.serviceimpl.EmployeeServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
