package com.substring.quiz.service1;


import com.substring.quiz.collections.Quiz;
import com.substring.quiz.dto.QuizDto;
import com.substring.quiz.repository.QuizRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class QuizServiceTemplate {


private final QuizRepository quizRepository;
private ModelMapper mapper;
public QuizServiceTemplate(QuizRepository quizRepository,ModelMapper mapper){
    this.quizRepository=quizRepository;
    this.mapper=mapper;
}


public QuizDto saveQuiz(QuizDto dto){
    Quiz quiz = mapper.map(dto, Quiz.class);
    String quizId= UUID.randomUUID().toString();
    quiz.setId(quizId);
    Quiz save = quizRepository.save(quiz);
    return mapper.map(save,QuizDto.class);
}


}
