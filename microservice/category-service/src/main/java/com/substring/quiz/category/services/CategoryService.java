package com.substring.quiz.category.services;

import com.substring.quiz.category.dto.CategoryDto;

import java.util.List;

public interface CategoryService {

    CategoryDto save(CategoryDto categoryDto);
    CategoryDto getById(Long id);
    String deleteCategory(Long id);
    CategoryDto updateCategory(Long id,CategoryDto dto);
    List<CategoryDto> findAll();
}
