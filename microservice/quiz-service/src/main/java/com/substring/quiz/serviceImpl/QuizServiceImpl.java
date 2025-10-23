package com.substring.quiz.serviceImpl;

import com.substring.quiz.collections.Quiz;
import com.substring.quiz.dto.CategoryDto;
import com.substring.quiz.dto.QuizDto;
import com.substring.quiz.repository.QuizRepository;
import com.substring.quiz.service.QuizService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
public class QuizServiceImpl implements QuizService {

    private final QuizRepository quizRepository;
    private final ModelMapper modelMapper;
    private final RestTemplate restTemplate;
    public QuizServiceImpl(QuizRepository quizRepository,ModelMapper modelMapper
                            ,RestTemplate restTemplate){
        this.quizRepository=quizRepository;
        this.modelMapper=modelMapper;
        this.restTemplate=restTemplate;
    }

    @Override
    public QuizDto saveQuiz(QuizDto dto) {
        Quiz entity = modelMapper.map(dto, Quiz.class);
        Quiz responseEntity = quizRepository.save(entity);
        QuizDto responseDto = modelMapper.map(responseEntity, QuizDto.class);
        return responseDto;
    }

    @Override
    public QuizDto getById(String id) {
        QuizDto responseDto=null;
        try{
            Quiz quiz = quizRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Quiz not found with id: " + id));
             responseDto = modelMapper.map(quiz, QuizDto.class);

            String categoryId = quiz.getCategoryId();
            String url="http://localhost:9091/api/v1/category/get/"+categoryId;

            CategoryDto catDto = restTemplate.getForObject(url, CategoryDto.class);
            responseDto.setCategoryDto(catDto);
        }
        catch (Exception e){
            responseDto.setCategoryDto(null);
        }
        return responseDto;
    }


    @Override
    public QuizDto updateQuiz(String quizId, QuizDto dto) {
       quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found with id: " + quizId));
        Quiz entity = modelMapper.map(dto, Quiz.class);
        entity.setId(quizId);
        Quiz save = quizRepository.save(entity);
        QuizDto responseDto = modelMapper.map(save, QuizDto.class);
        return responseDto;
    }

    @Override
    public String deleteQuiz(String id) {
        quizRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quiz not found with id: " + id));
        quizRepository.deleteById(id);
        return "Quiz deleted succesfully with id "+id;
    }

    @Override
    public List<QuizDto> getAllQuiz() {
        List<Quiz> all = quizRepository.findAll();
        List<QuizDto> list = all.stream().map(m -> modelMapper.map(m, QuizDto.class)).toList();
        return list;

    }

    @Override
    public List<QuizDto> getAllQuizByCategoryId(String catId) {

        List<Quiz> all = quizRepository.findByCategoryId(catId);
        List<QuizDto> list = all.stream().map(m -> modelMapper.map(m, QuizDto.class)).toList();
        return list;
    }
}
