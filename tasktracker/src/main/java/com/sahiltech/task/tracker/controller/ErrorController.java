package com.sahiltech.task.tracker.controller;

import com.sahiltech.task.tracker.model.Errors;
import com.sahiltech.task.tracker.serviceimpl.ErrorServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
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
    
    @PostMapping("/reopen/{id}")
    public ResponseEntity<String> reopenError(
            @PathVariable("id") Long id,
            @RequestParam("assignedTo") Long assignedTo,
            @RequestParam("reason") String reason) {
        String msg = service.reopenError(id, assignedTo, reason);
        return new ResponseEntity<>(msg, HttpStatus.OK);
    }
    
    @PutMapping("/update-status/{id}")
    public ResponseEntity<String> updateStatus(
            @PathVariable("id") Long id,
            @RequestParam("status") String status,
            @RequestParam("resolvedBy") Long resolvedBy) {
        String msg = service.updateStatus(id, status, resolvedBy);
        return new ResponseEntity<>(msg, HttpStatus.OK);
    }
    
    @GetMapping("/getById/{id}")
    public ResponseEntity<Errors> getErrorById(@PathVariable("id") Long id) {
        Errors error = service.getErrorById(id);
        return new ResponseEntity<>(error, HttpStatus.OK);
    }
    
    @GetMapping("/history/{id}")
    public ResponseEntity<?> getErrorHistory(@PathVariable("id") Long id) {
        var history = service.getErrorHistory(id);
        return new ResponseEntity<>(history, HttpStatus.OK);
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

    @GetMapping("/smart")
    public ResponseEntity<Map<String, Object>> getSmartPaginatedErrors(
            @RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "sortBy", defaultValue = "id") String sortBy,
            @RequestParam(name = "sortDir", defaultValue = "asc") String sortDir,
            @RequestParam(name = "search", required = false) String search
    ) {
        Map<String, Object> response = service.getSmartPaginatedErrors(page, size, sortBy, sortDir, search);
        return ResponseEntity.ok(response);
    }
}