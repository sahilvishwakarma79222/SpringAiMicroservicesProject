package com.substring.quiz.repository;

import com.substring.quiz.collection.Quiz;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface QuizRepository extends MongoRepository<Quiz,String> {

}
