package com.substring.quiz.controller;

import com.substring.quiz.dto.QuizDto;
import com.substring.quiz.service.QuizServiceTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/quiz")
public class QuizController {

    private final QuizServiceTemplate quizServiceTemplate;
    public QuizController(QuizServiceTemplate quizServiceTemplate){
        this.quizServiceTemplate=quizServiceTemplate;
    }

    @PostMapping("/save")
    public ResponseEntity<?> saveQuiz(@RequestBody QuizDto quizDto){
        QuizDto dto = quizServiceTemplate.saveQuiz(quizDto);

        return new ResponseEntity<>(dto, HttpStatus.OK);
    }



}
