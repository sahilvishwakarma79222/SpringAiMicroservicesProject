package com.sahiltech.task.tracker.controller;

import com.sahiltech.task.tracker.model.Project;
import com.sahiltech.task.tracker.serviceimpl.ProjectServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/v1/project")
public class ProjectController {

    private final ProjectServiceImpl service;

    public ProjectController(ProjectServiceImpl service){
        this.service = service;
    }

    @PostMapping("/save")
    public ResponseEntity<Project> saveProject(@RequestBody Project project){
        Project project1 = service.saveProject(project);
        return new ResponseEntity<>(project1, HttpStatus.OK);
    }

    @GetMapping("/getProjectsCount")
    public ResponseEntity<Integer> saveEmployeeCount(){
        int count = service.countProject();
        return new ResponseEntity<>(count, HttpStatus.OK);
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<Project> getProjectById(
            @PathVariable("id") Long id){

        Project project1 = service.getProjectById(id);
        return new ResponseEntity<>(project1, HttpStatus.OK);
    }

    @GetMapping("/getAllProjects")
    public ResponseEntity<List<Project>> getAllProjects(){
        List<Project> projects = service.getAllProjects();
        return new ResponseEntity<>(projects, HttpStatus.OK);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateProject(
            @PathVariable("id") Long id,
            @RequestBody Project project){

        String msg = service.updateProject(id, project);
        return new ResponseEntity<>(msg, HttpStatus.OK);
    }

    @GetMapping("/smart")
    public ResponseEntity<Map<String, Object>> getProjectsSmart(
            @RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "sortBy", defaultValue = "id") String sortBy,
            @RequestParam(name = "sortDir", defaultValue = "asc") String sortDir,
            @RequestParam(name = "search", required = false) String search
    ) {
        Map<String, Object> response =
                service.getSmartPaginatedProjects(page, size, sortBy, sortDir, search);

        return ResponseEntity.ok(response);
    }
}