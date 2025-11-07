package com.sahiltech.task.tracker.controller;

import com.sahiltech.task.tracker.model.Task;
import com.sahiltech.task.tracker.serviceimpl.TaskServiceImpl;
import org.apache.coyote.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/task")
public class TaskRepoController {

private final TaskServiceImpl service;

public TaskRepoController(TaskServiceImpl service){
    this.service=service;
}

@PostMapping("/save")
public ResponseEntity<Task> saveTask(@RequestBody Task task){
    return new ResponseEntity<>(service.createTask(task), HttpStatus.OK);
}


    @GetMapping("/getById/{id}")
    public ResponseEntity<Task> getById(@PathVariable Long id){
        return new ResponseEntity<>(service.getByIdTask(id),HttpStatus.OK);
    }

    @GetMapping("/getByEmployeeId/{id}")
    public ResponseEntity<Task> getByEmpId(@PathVariable Long id){
        return new ResponseEntity<>(service.getByIdEmployeeId(id),HttpStatus.OK);
    }

    @GetMapping("/getByProjectId/{id}")
    public ResponseEntity<Task> getByProjectId(@PathVariable Long id){
        return new ResponseEntity<>(service.getByIdProjectId(id),HttpStatus.OK);
    }

@GetMapping("/all")
public ResponseEntity<List<Task>> getAllTask(){
    return new ResponseEntity<>(service.getAllTask(),HttpStatus.OK);
}

@PutMapping("/update/{id}")
public ResponseEntity<String> updateTask(@PathVariable long id,@RequestBody Task task){
    return new ResponseEntity<>(service.updateTask(id,task),HttpStatus.OK);
}

@DeleteMapping("/delete/{id}")
public ResponseEntity<String> deleteTaskById(@PathVariable long id){
    return new ResponseEntity<>(service.deleteTask(id),HttpStatus.OK);
}




}
