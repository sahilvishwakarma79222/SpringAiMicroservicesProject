package com.substring.quiz.service;

import com.substring.quiz.collection.Quiz;
import com.substring.quiz.dto.QuizDto;
import com.substring.quiz.repository.QuizRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class QuizServiceTemplate {

    private final QuizRepository quizRepository;
    private final ModelMapper modelMapper;
    private final RestTemplate restTemplate;
    public QuizServiceTemplate(QuizRepository quizRepository, ModelMapper modelMapper,RestTemplate restTemplate){
        this.modelMapper=modelMapper;
        this.quizRepository=quizRepository;
        this.restTemplate=restTemplate;
    }

    public QuizDto saveQuiz(QuizDto quizDto){
        Quiz quiz = modelMapper.map(quizDto, Quiz.class);
        Quiz save = quizRepository.save(quiz);
        return modelMapper.map(save,QuizDto.class);
    }







}
