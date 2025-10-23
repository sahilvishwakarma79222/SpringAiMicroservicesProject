package com.substring.quiz.repository;

import com.substring.quiz.collections.Quiz;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface QuizRepository extends MongoRepository<Quiz,String> {

    List<Quiz> findByTitle();
    List<Quiz> findByCategoryId(String catId);
}
