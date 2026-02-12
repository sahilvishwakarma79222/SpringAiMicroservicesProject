package com.sahiltech.task.tracker.controller;

import com.sahiltech.task.tracker.model.Task;
import com.sahiltech.task.tracker.serviceimpl.TaskServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/v1/task")
public class TaskRepoController {

    private final TaskServiceImpl service;

    public TaskRepoController(TaskServiceImpl service){
        this.service = service;
    }

    @PostMapping("/save")
    public ResponseEntity<Task> saveTask(@RequestBody Task task){
        return new ResponseEntity<>(service.createTask(task), HttpStatus.OK);
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<Task> getById(@PathVariable("id") Long id){
        return new ResponseEntity<>(service.getByIdTask(id), HttpStatus.OK);
    }

    @GetMapping("/getByEmployeeId/{id}")
    public ResponseEntity<List<Task>> getByEmpId(@PathVariable("id") Long id){
        return new ResponseEntity<>(service.getByIdEmployeeId(id), HttpStatus.OK);
    }

    @GetMapping("/getByProjectId/{id}")
    public ResponseEntity<List<Task>> getByProjectId(@PathVariable("id") Long id){
        return new ResponseEntity<>(service.getByIdProjectId(id), HttpStatus.OK);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Task>> getAllTask(){
        return new ResponseEntity<>(service.getAllTask(), HttpStatus.OK);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateTask(@PathVariable("id") long id,
                                             @RequestBody Task task){
        return new ResponseEntity<>(service.updateTask(id, task), HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteTaskById(@PathVariable("id") long id){
        return new ResponseEntity<>(service.deleteTask(id), HttpStatus.OK);
    }

     @GetMapping("/smart")
    public ResponseEntity<Map<String, Object>> getTasksSmart(
            @RequestParam(name="page", defaultValue = "1") int page,
            @RequestParam(name="size", defaultValue = "10") int size,
            @RequestParam(name="sortBy", defaultValue = "id") String sortBy,
            @RequestParam(name="sortDir", defaultValue = "asc") String sortDir,
            @RequestParam(name="search", required = false) String search
    ) {
        Map<String, Object> response =
                service.getSmartPaginatedProjects(page, size, sortBy, sortDir, search);
        return ResponseEntity.ok(response);
    }

     @GetMapping("/employee/{employeeId}/smart")
    public ResponseEntity<Map<String, Object>> getTasksByEmployeeSmart(
            @PathVariable("employeeId") Long employeeId,
            @RequestParam(name="page", defaultValue = "1") int page,
            @RequestParam(name="size", defaultValue = "10") int size,
            @RequestParam(name="sortBy", defaultValue = "id") String sortBy,
            @RequestParam(name="sortDir", defaultValue = "asc") String sortDir,
            @RequestParam(name="search", required = false) String search
    ) {
        Map<String, Object> response =
                service.getByEmployeeIdSmart(employeeId, page, size, sortBy, sortDir, search);
        return ResponseEntity.ok(response);
    }

     @GetMapping("/project/{projectId}/smart")
    public ResponseEntity<Map<String, Object>> getTasksByProjectSmart(
            @PathVariable("projectId") Long projectId,
            @RequestParam(name="page", defaultValue = "1") int page,
            @RequestParam(name="size", defaultValue = "10") int size,
            @RequestParam(name="sortBy", defaultValue = "id") String sortBy,
            @RequestParam(name="sortDir", defaultValue = "asc") String sortDir,
            @RequestParam(name="search", required = false) String search
    ) {
        Map<String, Object> response =
                service.getByProjectIdSmart(projectId, page, size, sortBy, sortDir, search);
        return ResponseEntity.ok(response);
    }
}