package com.substring.quiz.controller1;

import com.substring.quiz.dto.QuizDto;
import com.substring.quiz.service1.QuizServiceTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/quiznew")
public class QuizController1 {

    private QuizServiceTemplate quizServiceTemplate;
    public QuizController1(QuizServiceTemplate quizServiceTemplate){
        this.quizServiceTemplate=quizServiceTemplate;
    }

    @PostMapping("/save")
    public ResponseEntity<?> saveQuiz(@RequestBody QuizDto dto){
        QuizDto quizDto = quizServiceTemplate.saveQuiz(dto);
        return new ResponseEntity<>(quizDto, HttpStatus.OK);
    }


}
