package com.sahiltech.task.tracker.serviceimpl;

import com.sahiltech.task.tracker.model.Task;
import com.sahiltech.task.tracker.repository.TaskRepo;
import org.springframework.stereotype.Service;

import java.util.List;

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
        return taskRepo.getAllTask();
    }

    public Task getByIdTask(Long id){
        return taskRepo.getById(id);
    }

    public Task getByIdEmployeeId(Long id){
        return taskRepo.getByEmployeeId(id);
    }

    public Task getByIdProjectId(Long id){
        return taskRepo.getByProjectId(id);
    }


    public String updateTask(Long id,Task task){
        return taskRepo.updateTask(id,task);
    }

    public String deleteTask(Long id){
        return taskRepo.deleteTask(id);
    }



}
