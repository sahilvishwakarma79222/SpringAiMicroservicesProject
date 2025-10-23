package com.substring.quiz.category.controller;

import com.substring.quiz.category.dto.CategoryDto;
import com.substring.quiz.category.services.CategoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/category")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService){
        this.categoryService=categoryService;
    }

    @PostMapping("/save")
    public ResponseEntity<?> saveCategory(@RequestBody CategoryDto dto){
        CategoryDto response = categoryService.save(dto);
        return new ResponseEntity<>(response,HttpStatus.OK);
    }

    @GetMapping("/get/{id}")
    public  ResponseEntity<?> getCategoryById(@PathVariable long id){
        CategoryDto response = categoryService.getById(id);
    return new ResponseEntity<>(response,HttpStatus.OK);
    }


    @PutMapping("/update/{id}")
    public  ResponseEntity<?> getCategoryById(@PathVariable long id,
                                              @RequestBody CategoryDto dto){
        CategoryDto response = categoryService.updateCategory(id,dto);
        return new ResponseEntity<>(response,HttpStatus.OK);
    }


    @GetMapping("/getAll")
    public ResponseEntity<List<CategoryDto>> getAll(){
        List<CategoryDto> all = categoryService.findAll();
        return new ResponseEntity<>(all,HttpStatus.OK);
    }
}
