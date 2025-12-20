package com.substring.quiz.service;

import org.springframework.web.client.RestTemplate;

public class QuizServiceTemplateCat {

    private final RestTemplate restTemplate;

    public QuizServiceTemplateCat(RestTemplate restTemplate){
        this.restTemplate=restTemplate;
    }

    public void findQuizByCategoryId(String catId){

    }






}
