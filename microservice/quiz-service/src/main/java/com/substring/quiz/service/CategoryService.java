package com.substring.quiz.service;

import com.substring.quiz.dto.CategoryDto;

public interface CategoryService {

    CategoryDto saveCategory(CategoryDto dto);
    CategoryDto getById(String categoryId);


}
