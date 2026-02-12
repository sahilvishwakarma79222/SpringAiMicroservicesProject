package com.sahiltech.task.tracker.serviceimpl;

import com.sahiltech.task.tracker.model.Task;
import com.sahiltech.task.tracker.repository.TaskRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class TaskServiceImpl {

    private final TaskRepo taskRepo;
    public TaskServiceImpl(TaskRepo taskRepo){
        this.taskRepo=taskRepo;
    }

    public Task createTask(Task task){
        return  taskRepo.saveTask(task);
    }

    public List<Task> getAllTask(){
        return taskRepo.getAllTasks();
    }

    public Task getByIdTask(Long id){
        return taskRepo.getById(id);
    }

    public List<Task> getByIdEmployeeId(Long id){
        return taskRepo.getByEmployeeId(id);
    }

    public List<Task> getByIdProjectId(Long id){
        return taskRepo.getByProjectId(id);
    }


    public String updateTask(Long id,Task task){
        return taskRepo.updateTask(id,task);
    }

    public String deleteTask(Long id){
        return taskRepo.deleteTask(id);
    }

    public Map<String, Object> getSmartPaginatedProjects(
            int page,
            int size,
            String sortBy,
            String sortDir,
            String search
    ) {
        return taskRepo.getTasksSmartPagination(page, size, sortBy, sortDir, search);
     }

    public Map<String, Object> getByEmployeeIdSmart(
            Long employeeId,
            int page,
            int size,
            String sortBy,
            String sortDir,
            String search
    ) {
        return taskRepo.getByEmployeeIdSmart(employeeId, page, size, sortBy, sortDir, search);
    }
    public Map<String, Object> getByProjectIdSmart(
            Long projectId,
            int page,
            int size,
            String sortBy,
            String sortDir,
            String search
    ) {
        return taskRepo.getByProjectIdSmart(projectId, page, size, sortBy, sortDir, search);
     }

}
