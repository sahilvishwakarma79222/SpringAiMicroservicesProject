package com.substring.quiz.service;

import com.substring.quiz.dto.QuizDto;

import java.util.List;

public interface QuizService {

    QuizDto saveQuiz(QuizDto dto);
    QuizDto getById(String id);
    QuizDto updateQuiz(String quizId,QuizDto dto);
    String deleteQuiz(String id);
    List<QuizDto> getAllQuiz();
    List<QuizDto> getAllQuizByCategoryId(String catId);


}
