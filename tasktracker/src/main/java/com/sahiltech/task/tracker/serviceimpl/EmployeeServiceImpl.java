package com.sahiltech.task.tracker.serviceimpl;

import com.sahiltech.task.tracker.model.Employee;
import com.sahiltech.task.tracker.repository.EmployeeRepo;
import org.springframework.stereotype.Service;

import java.util.List;

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

public Employee getById(Long id){
    Employee employee = employeeRepo.getById(id);
    return employee;

}
public String updateEmployee(Long id,Employee employee){
    String msg = employeeRepo.updateEmployee(id, employee);
    return msg;
}

public List<Employee> getAllEmployee(){
    return employeeRepo.getAll();
}


}
