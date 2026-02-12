package com.sahiltech.task.tracker.controller;

import com.sahiltech.task.tracker.model.NewModuleTask;
import com.sahiltech.task.tracker.serviceimpl.NewModuleTaskServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("api/v1/newModuleTask")
public class NewModuleTaskController {

    private final NewModuleTaskServiceImpl service;

    public NewModuleTaskController(NewModuleTaskServiceImpl service) {
        this.service = service;
    }

    @PostMapping("/save")
    public ResponseEntity<NewModuleTask> saveTask(@RequestBody NewModuleTask task) {
        NewModuleTask saved = service.saveTask(task);
        return new ResponseEntity<>(saved, HttpStatus.OK);
    }

    @GetMapping("/count")
    public ResponseEntity<Integer> countTasks() {
        int count = service.countTasks();
        return new ResponseEntity<>(count, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<NewModuleTask> getTaskById(
            @PathVariable("id") Long id) {

        NewModuleTask task = service.getTaskById(id);
        return new ResponseEntity<>(task, HttpStatus.OK);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateTask(
            @PathVariable("id") Long id,
            @RequestBody NewModuleTask task) {

        String msg = service.updateTask(id, task);
        return new ResponseEntity<>(msg, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteTask(
            @PathVariable("id") Long id) {

        String msg = service.deleteTask(id);
        return new ResponseEntity<>(msg, HttpStatus.OK);
    }

    @GetMapping("/all")
    public ResponseEntity<List<NewModuleTask>> getAllTasks() {
        List<NewModuleTask> tasks = service.getAllTasks();
        return new ResponseEntity<>(tasks, HttpStatus.OK);
    }

    @GetMapping("/smart")
    public ResponseEntity<Map<String, Object>> getSmartPaginatedTasks(
            @RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "sortBy", defaultValue = "id") String sortBy,
            @RequestParam(name = "sortDir", defaultValue = "asc") String sortDir,
            @RequestParam(name = "search", required = false) String search
    ) {

        Map<String, Object> response =
                service.getSmartPaginatedTasks(page, size, sortBy, sortDir, search);

        return ResponseEntity.ok(response);
    }
}