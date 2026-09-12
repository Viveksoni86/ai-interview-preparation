package com.vivek.ai.service;

import java.util.List;


import org.springframework.stereotype.Service;

import com.vivek.ai.entity.Difficulty;
import com.vivek.ai.entity.Topic;
import com.vivek.ai.entity.Question;
import com.vivek.ai.repository.QuestionRepository;
import com.vivek.ai.dto.QuestionRequest;
import com.vivek.ai.dto.QuestionResponse ;


@Service
public class QuestionService {
	
	private final QuestionRepository repository ;
	
	public QuestionService(
	        QuestionRepository repository) {

	    this.repository = repository;
	}
	
	
	public QuestionResponse saveQuestion(QuestionRequest request) {
		
		Question question = toEntity(request);
		
		Question savedQuestion = repository.save(question);
		
		return toResponse(savedQuestion);
		
	
	}
	
	public List<Question> getAllQuestion() {
		return repository.findAll();
	}
	
	public Question getQuestionById(Long id) {
		return repository.findById(id).orElse(null);
	}
	
	public List<Question> getByTopic(Topic topic) {
		return repository.findByTopic(topic);
	}
	
	public List<Question> getByDifficulty(Difficulty difficulty) {
		return repository.findByDifficulty(difficulty);
	}
	
	public List<Question> getByTopicAndDifficulty(
			Topic topic,
			Difficulty difficulty 
			) {
		return repository.findByTopicAndDifficulty(topic , difficulty);
	}
	
	public Question updateQuestion(Long id , Question updatedQuestion) {
		Question question = repository.findById(id).orElse(null);
		
		if(question == null) {
			return null ;
		}
		
		question.setQuestion(updatedQuestion.getQuestion()) ;
		question.setAnswer(updatedQuestion.getAnswer());
		question.setTopic(updatedQuestion.getTopic());
		question.setDifficulty(updatedQuestion.getDifficulty());
		
		return repository.save(question) ;
		
	}
	
	public void deleteQuestion(Long id) {
		repository.deleteById(id);	
		}
	
	private Question toEntity( QuestionRequest dto) {
		Question question = new Question();
		
		question.setQuestion(dto.getQuestion());
		question.setAnswer(dto.getAnswer());
		question.setTopic(dto.getTopic());
		question.setDifficulty(dto.getDifficulty());
		
		return question ;
	}
	
	private QuestionResponse toResponse(Question question) {

	    return new QuestionResponse(
	            question.getId(),
	            question.getQuestion(),
	            question.getAnswer(),
	            question.getTopic(),
	            question.getDifficulty());
	}

}
