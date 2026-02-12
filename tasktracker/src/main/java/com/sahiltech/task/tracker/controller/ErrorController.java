package com.sahiltech.task.tracker.controller;

import com.sahiltech.task.tracker.model.Errors;
import com.sahiltech.task.tracker.serviceimpl.ErrorServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("api/v1/errors")
public class ErrorController {

    private final ErrorServiceImpl service;

    public ErrorController(ErrorServiceImpl service) {
        this.service = service;
    }

    @PostMapping("/save")
    public ResponseEntity<Errors> saveError(@RequestBody Errors error) {
        Errors saved = service.saveError(error);
        return new ResponseEntity<>(saved, HttpStatus.OK);
    }

    @GetMapping("/count")
    public ResponseEntity<Integer> countErrors() {
        int count = service.countErrors();
        return new ResponseEntity<>(count, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Errors> getErrorById(@PathVariable("id") Long id) {
        Errors error = service.getErrorById(id);
        return new ResponseEntity<>(error, HttpStatus.OK);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateError(
            @PathVariable("id") Long id,
            @RequestBody Errors error) {

        String msg = service.updateError(id, error);
        return new ResponseEntity<>(msg, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteError(@PathVariable("id") Long id) {
        String msg = service.deleteError(id);
        return new ResponseEntity<>(msg, HttpStatus.OK);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Errors>> getAllErrors() {
        List<Errors> allErrors = service.getAllErrors();
        return new ResponseEntity<>(allErrors, HttpStatus.OK);
    }

    @GetMapping("/smart")
    public ResponseEntity<Map<String, Object>> getSmartPaginatedErrors(
            @RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "sortBy", defaultValue = "id") String sortBy,
            @RequestParam(name = "sortDir", defaultValue = "asc") String sortDir,
            @RequestParam(name = "search", required = false) String search
    ) {
        Map<String, Object> response =
                service.getSmartPaginatedErrors(page, size, sortBy, sortDir, search);

        return ResponseEntity.ok(response);
    }
}