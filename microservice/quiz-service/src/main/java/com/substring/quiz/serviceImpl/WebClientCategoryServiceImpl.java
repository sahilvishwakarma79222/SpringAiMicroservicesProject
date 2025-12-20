//package com.substring.quiz.serviceImpl;
//
//import com.substring.quiz.dto.CategoryDto;
//import com.substring.quiz.service.WebClientCategoryService;
//import org.springframework.stereotype.Service;
//import org.springframework.web.reactive.function.client.WebClient;
//
//@Service
//public class WebClientCategoryServiceImpl implements WebClientCategoryService {
//
//    private final WebClient webClient;
//
//    public WebClientCategoryServiceImpl(WebClient.Builder webClientBuilder){
//        this.webClient=webClientBuilder.baseUrl("http://localhost:9091").build();
//    }
//
//    @Override
//    public CategoryDto getByCategoryId(String categoryId) {
//
//        CategoryDto categoryDto = webClient.get().uri("/api/v1/category/{categoryId}", categoryId)
//                .retrieve().bodyToMono(CategoryDto.class).block();
//
//        return categoryDto;
//    }
//
//
//
//
//
//
//
//}
