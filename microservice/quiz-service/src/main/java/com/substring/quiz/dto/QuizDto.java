package com.substring.quiz.dto;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Field;

@Setter
@Getter
public class QuizDto {

    private  String id;

    private  String title;
    private  String description;
    private  Integer maxMarks;
    private  Integer timeLimit;
    private  String createdBy;
    private  Integer noOfQuestions;
    private  String imageUrl;
    private  Boolean live;
    private  Integer passingMarks;
    private  String categoryId;
    private CategoryDto categoryDto;
}
