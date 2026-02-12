package com.sahiltech.task.tracker.controller;

import com.sahiltech.task.tracker.model.Module;
import com.sahiltech.task.tracker.serviceimpl.NewModuleServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("api/v1/modules")
public class ModuleController {

    private final NewModuleServiceImpl service;

    public ModuleController(NewModuleServiceImpl service) {
        this.service = service;
    }

    @PostMapping("/save")
    public ResponseEntity<Module> saveModule(@RequestBody Module module) {
        Module saved = service.saveModule(module);
        return new ResponseEntity<>(saved, HttpStatus.OK);
    }

    @GetMapping("/count")
    public ResponseEntity<Integer> countModules() {
        int count = service.countModules();
        return new ResponseEntity<>(count, HttpStatus.OK);
    }

    @GetMapping("/getByProjectId/{projectId}")
    public ResponseEntity<List<Module>> getAllModuleByProjectId(
            @PathVariable("projectId") Long projectId) {

        List<Module> allModule = service.getAllModulesByProjectId(projectId);
        return new ResponseEntity<>(allModule, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Module> getModuleById(
            @PathVariable("id") Long id) {

        Module module = service.getModuleById(id);
        return new ResponseEntity<>(module, HttpStatus.OK);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateModule(
            @PathVariable("id") Long id,
            @RequestBody Module module) {

        String msg = service.updateModule(id, module);
        return new ResponseEntity<>(msg, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteModule(
            @PathVariable("id") Long id) {

        String msg = service.deleteModule(id);
        return new ResponseEntity<>(msg, HttpStatus.OK);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Module>> getAllModules() {
        List<Module> modules = service.getAllModules();
        return new ResponseEntity<>(modules, HttpStatus.OK);
    }

    @GetMapping("/smart")
    public ResponseEntity<Map<String, Object>> getSmartPaginatedModules(
            @RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "sortBy", defaultValue = "id") String sortBy,
            @RequestParam(name = "sortDir", defaultValue = "asc") String sortDir,
            @RequestParam(name = "search", required = false) String search
    ) {
        Map<String, Object> response =
                service.getSmartPaginatedModules(page, size, sortBy, sortDir, search);

        return ResponseEntity.ok(response);
    }
}