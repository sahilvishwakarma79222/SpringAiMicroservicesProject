package com.substring.quiz.category.serviceImpl;

import com.substring.quiz.category.dto.CategoryDto;
import com.substring.quiz.category.entity.Category;
import com.substring.quiz.category.repo.CategoryRepository;
import com.substring.quiz.category.services.CategoryService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {


    private final ModelMapper modelMapper;
    private final CategoryRepository categoryRepo;

    public CategoryServiceImpl(ModelMapper modelMapper,CategoryRepository categoryRepo){
        this.categoryRepo=categoryRepo;
        this.modelMapper=modelMapper;
    }


    @Override
    public CategoryDto save(CategoryDto categoryDto) {
        Category entity = modelMapper.map(categoryDto, Category.class);
        Category save = categoryRepo.save(entity);
        return modelMapper.map(save,CategoryDto.class);
    }

    @Override
    public CategoryDto getById(Long id) {
        Category category = categoryRepo.findById(id).orElseThrow(() -> new RuntimeException("category not found with id " + id));
        CategoryDto response = modelMapper.map(category, CategoryDto.class);
        return response;

    }

    @Override
    public String deleteCategory(Long id) {
        categoryRepo.findById(id).orElseThrow(() -> new RuntimeException("category not found with id " + id));
        categoryRepo.deleteById(id);
        return "category deleted succesfully with id"+id;
    }

    @Override
    public CategoryDto updateCategory(Long id, CategoryDto dto) {
        Category category = categoryRepo.findById(id).orElseThrow(() -> new RuntimeException("category not found with id " + id));
        Category entityUpdated = modelMapper.map(dto, Category.class);
        entityUpdated.setId(id);
        Category response = categoryRepo.save(entityUpdated);
        CategoryDto responseDto = modelMapper.map(response, CategoryDto.class);
        return responseDto;
    }

    @Override
    public List<CategoryDto> findAll() {
        List<Category> all = categoryRepo.findAll();
        List<CategoryDto> list = all.stream().map(m -> modelMapper.map(m, CategoryDto.class)).toList();

        return list;
    }
}
