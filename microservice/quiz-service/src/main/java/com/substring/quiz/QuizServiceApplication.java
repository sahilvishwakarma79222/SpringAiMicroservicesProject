package com.substring.quiz;

import com.substring.quiz.repository.QuizRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class QuizServiceApplication implements CommandLineRunner {

    @Autowired
    private QuizRepository repo;

	public static void main(String[] args) {
		SpringApplication.run(QuizServiceApplication.class, args);
	}

    @Override
    public void run(String... args) throws Exception {
    System.out.println("started");

//        Quiz quiz = Quiz.builder()
//                .id(UUID.randomUUID().toString())  // random unique id
//                .title("c++ Basics Quiz")
//                .description("Test your c++ fundamentals")
//                .maxMarks(100)
//                .timeLimit(60)
//                .createdBy("Sahil")
//                .noOfQuestions(10)
//                .imageUrl("java.png")
//                .live(true)
//                .passingMarks(40)
//                .categoryId("123")  // set categoryId
//                .build();
//
//                repo.save(quiz);


    }
}
