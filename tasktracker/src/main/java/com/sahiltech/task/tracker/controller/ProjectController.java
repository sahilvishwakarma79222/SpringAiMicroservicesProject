package com.sahiltech.task.tracker.controller;

import com.sahiltech.task.tracker.model.Project;
import com.sahiltech.task.tracker.serviceimpl.ProjectServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/project")
public class ProjectController {

private final ProjectServiceImpl service;

public ProjectController(ProjectServiceImpl service){
    this.service=service;
}

@PostMapping("/save")
public ResponseEntity<Project> saveProject(@RequestBody Project project){
    Project project1 = service.saveProject(project);
    return new ResponseEntity<>(project1, HttpStatus.OK);
}


    @GetMapping("/getById/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable Long id){
        Project project1 = service.getProjectById(id);
        return new ResponseEntity<>(project1, HttpStatus.OK);
    }

    @GetMapping("/getAllProjects")
    public ResponseEntity<List<Project>> getAllProjects(){
        List<Project> projects = service.getAllProjects();
        return new ResponseEntity<>(projects, HttpStatus.OK);
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateProject(@PathVariable Long id,@RequestBody Project project){
        String msg = service.updateProject(id, project);
        return new ResponseEntity<>(msg, HttpStatus.OK);
    }



}
