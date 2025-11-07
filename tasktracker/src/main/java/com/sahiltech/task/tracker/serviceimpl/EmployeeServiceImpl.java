package com.sahiltech.task.tracker.serviceimpl;

import com.sahiltech.task.tracker.model.Employee;
import com.sahiltech.task.tracker.repository.EmployeeRepo;
import org.springframework.stereotype.Service;

@Service
public class EmployeeServiceImpl {

private final EmployeeRepo employeeRepo;

public EmployeeServiceImpl(EmployeeRepo employeeRepo){
    this.employeeRepo=employeeRepo;
}

public Employee saveEmployee(Employee employee){
    Employee save = employeeRepo.save(employee);
    return save;
}



}
