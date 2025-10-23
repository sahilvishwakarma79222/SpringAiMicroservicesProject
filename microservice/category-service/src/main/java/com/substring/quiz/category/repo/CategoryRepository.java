package com.substring.quiz.category.repo;

import com.substring.quiz.category.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category,Long> {

    
}
