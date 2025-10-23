package com.substring.quiz.controller;

import com.substring.quiz.dto.QuizDto;
import com.substring.quiz.service.QuizService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/quiz")
public class QuizController {

private final QuizService quizService;

public QuizController(QuizService quizService){
    this.quizService=quizService;
}

@PostMapping("/save")
public ResponseEntity<?> saveQuiz(@RequestBody QuizDto dto){
    QuizDto quizDto = quizService.saveQuiz(dto);
    return new ResponseEntity<>(quizDto, HttpStatus.OK);
}

@GetMapping("/get/{quizId}")
public ResponseEntity<?> getQuizById(@PathVariable String quizId){
    QuizDto dto = quizService.getById(quizId);
    return new ResponseEntity<>(dto,HttpStatus.OK);
}

    @GetMapping("/getAll")
    public ResponseEntity<?> getAllQuiz(){
        List<QuizDto> allQuiz = quizService.getAllQuiz();
        return new ResponseEntity<>(allQuiz,HttpStatus.OK);
    }

    @GetMapping("/getByCategoryId/{catId}")
    public ResponseEntity<?> getAllQuizByCategoryId(@PathVariable String catId){
        List<QuizDto> allQuiz = quizService.getAllQuiz();
        return new ResponseEntity<>(allQuiz,HttpStatus.OK);
    }

    @PutMapping("/update/{quizId}")
    public ResponseEntity<?> updateQuiz(@RequestBody QuizDto dto,@PathVariable String quizId){
        QuizDto quizDto = quizService.updateQuiz(quizId, dto);
        return new ResponseEntity<>(quizDto, HttpStatus.OK);
    }
}
