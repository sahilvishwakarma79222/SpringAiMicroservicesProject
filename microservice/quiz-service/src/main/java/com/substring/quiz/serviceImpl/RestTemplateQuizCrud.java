package com.substring.quiz.serviceImpl;

import com.substring.quiz.collections.Quiz;
import com.substring.quiz.dto.CategoryDto;
import com.substring.quiz.dto.QuizDto;
import com.substring.quiz.repository.QuizRepository;
import com.substring.quiz.service.QuizService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service("resttemplate")
public class RestTemplateQuizCrud implements QuizService {

    private final QuizRepository quizRepository;
    private final ModelMapper modelMapper;
    private final RestTemplate restTemplate;
    private final String CATEGORY_SERVICE_BASE_URL = "http://localhost:9091/api/v1/category";

    public RestTemplateQuizCrud(QuizRepository quizRepository, ModelMapper modelMapper, RestTemplate restTemplate) {
        this.quizRepository = quizRepository;
        this.modelMapper = modelMapper;
        this.restTemplate = restTemplate;
    }


    @Override
    public QuizDto saveQuiz(QuizDto dto) {

        // 1️⃣ Category validation before saving quiz
        CategoryDto categoryDto = null;
        try {
            String url = CATEGORY_SERVICE_BASE_URL + "/get/" + dto.getCategoryId();
            categoryDto = restTemplate.getForObject(url, CategoryDto.class);
        } catch (HttpClientErrorException e) {
            throw new RuntimeException("❌ Invalid category! No category found with id: " + dto.getCategoryId());
        } catch (Exception e) {
            throw new RuntimeException("❌ Unable to connect to Category Service: " + e.getMessage());
        }

        // 2️⃣ Save quiz if category exists
        if (categoryDto == null) {
            throw new RuntimeException("❌ Cannot create quiz — Category not found for id: " + dto.getCategoryId());
        }

        Quiz quiz = modelMapper.map(dto, Quiz.class);
        Quiz saved = quizRepository.save(quiz);
        QuizDto responseDto = modelMapper.map(saved, QuizDto.class);
        responseDto.setCategoryDto(categoryDto);
        return responseDto;
    }

    // ✅ READ QUIZ BY ID
    @Override
    public QuizDto getById(String id) {
        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("❌ Quiz not found with id: " + id));

        QuizDto dto = modelMapper.map(quiz, QuizDto.class);

        try {
            String url = CATEGORY_SERVICE_BASE_URL + "/get/" + quiz.getCategoryId();
            CategoryDto catDto = restTemplate.getForObject(url, CategoryDto.class);
            dto.setCategoryDto(catDto);
        } catch (Exception e) {
            dto.setCategoryDto(null); // category service unavailable or invalid id
        }

        return dto;
    }

    // ✅ UPDATE QUIZ
    @Override
    public QuizDto updateQuiz(String quizId, QuizDto dto) {
        Quiz existing = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("❌ Quiz not found with id: " + quizId));

        // Check category before update
        CategoryDto categoryDto = null;
        try {
            String url = CATEGORY_SERVICE_BASE_URL + "/get/" + dto.getCategoryId();
            categoryDto = restTemplate.getForObject(url, CategoryDto.class);
        } catch (HttpClientErrorException e) {
            throw new RuntimeException("❌ Invalid category! No category found with id: " + dto.getCategoryId());
        } catch (Exception e) {
            throw new RuntimeException("❌ Unable to connect to Category Service: " + e.getMessage());
        }

        if (categoryDto == null) {
            throw new RuntimeException("❌ Cannot update quiz — Category not found for id: " + dto.getCategoryId());
        }

        // update entity
        Quiz updatedQuiz = modelMapper.map(dto, Quiz.class);
        updatedQuiz.setId(existing.getId());

        Quiz saved = quizRepository.save(updatedQuiz);
        QuizDto responseDto = modelMapper.map(saved, QuizDto.class);
        responseDto.setCategoryDto(categoryDto);

        return responseDto;
    }

    // ✅ DELETE QUIZ
    @Override
    public String deleteQuiz(String id) {
        quizRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("❌ Quiz not found with id: " + id));
        quizRepository.deleteById(id);
        return "✅ Quiz deleted successfully with id: " + id;
    }

    // ✅ GET ALL QUIZZES
    @Override
    public List<QuizDto> getAllQuiz() {
        List<Quiz> all = quizRepository.findAll();
        return all.stream().map(quiz -> {
            QuizDto dto = modelMapper.map(quiz, QuizDto.class);

            try {
                String url = CATEGORY_SERVICE_BASE_URL + "/get/" + quiz.getCategoryId();
                CategoryDto catDto = restTemplate.getForObject(url, CategoryDto.class);
                dto.setCategoryDto(catDto);
            } catch (Exception e) {
                dto.setCategoryDto(null);
            }

            return dto;
        }).toList();
    }

    // ✅ GET QUIZZES BY CATEGORY ID
    @Override
    public List<QuizDto> getAllQuizByCategoryId(String catId) {
        List<Quiz> quizzes = quizRepository.findByCategoryId(catId);
        return quizzes.stream().map(quiz -> modelMapper.map(quiz, QuizDto.class)).toList();
    }

}
