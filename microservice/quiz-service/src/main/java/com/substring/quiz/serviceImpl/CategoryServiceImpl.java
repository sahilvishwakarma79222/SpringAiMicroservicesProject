//package com.substring.quiz.serviceImpl;
//
//import com.substring.quiz.dto.CategoryDto;
//import com.substring.quiz.service.CategoryService;
//import org.modelmapper.ModelMapper;
//import org.springframework.stereotype.Service;
//import org.springframework.web.reactive.function.client.WebClient;
//
//@Service
//public class CategoryServiceImpl implements CategoryService {
//
//    private final ModelMapper modelMapper;
//    private final WebClient.Builder builder;
//    private final WebClient webClient;
//    public  CategoryServiceImpl(ModelMapper modelMapper,WebClient.Builder builder
//    ,WebClient webClient){
//        this.modelMapper=modelMapper;
//        this.builder=builder;
//        this.webClient=webClient;
//    }
//
//
//    @Override
//    public CategoryDto saveCategory(CategoryDto dto) {
//        return null;
//    }
//
//    @Override
//    public CategoryDto getById(String categoryId) {
//
//        try{
//            CategoryDto catDto = webClient.get().uri("/api/v1/category/get/{categoryId}", categoryId)
//                    .retrieve()
//                    .bodyToMono(CategoryDto.class)
//                    .block();
//        return  catDto;
//        } catch (Exception e) {
//                return null;
//        }
//
//    }
//}
