package com.substring.quiz.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class CategoryDto {
    private long id;
    private String title;
    private String description;
    private boolean active;
}