package com.sahiltech.task.tracker.serviceimpl;

import com.sahiltech.task.tracker.model.Employee;
import com.sahiltech.task.tracker.repository.EmployeeRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class EmployeeServiceImpl {

private final EmployeeRepo employeeRepo;

public EmployeeServiceImpl(EmployeeRepo employeeRepo){
    this.employeeRepo=employeeRepo;
}

public int countEmployee(){
    int employeeCount = employeeRepo.countAllEmployee();
    return employeeCount;
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

    public Map<String, Object> getSmartPaginatedProjects(
            int page,
            int size,
            String sortBy,
            String sortDir,
            String search
    ) {
        return employeeRepo.getProjectsSmartPagination(page, size, sortBy, sortDir, search);
    }

}
