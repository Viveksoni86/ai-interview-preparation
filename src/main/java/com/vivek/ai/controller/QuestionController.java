package com.vivek.ai.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List ;

import com.vivek.ai.entity.Question;
import com.vivek.ai.entity.Difficulty;
import com.vivek.ai.entity.Topic;
import com.vivek.ai.service.QuestionService; 
import com.vivek.ai.dto.QuestionResponse; 
import com.vivek.ai.dto.QuestionRequest; 
import jakarta.validation.Valid ;

@RestController
@RequestMapping("/api/questions")
public class QuestionController {
	
	private final QuestionService service ;
	
	public QuestionController(QuestionService service) {
		this.service = service ;
		
	}
	
	@PostMapping
	public QuestionResponse addQuestion (
		@Valid @RequestBody QuestionRequest request ) {
		
		return service.saveQuestion(request);
	}
	
	
	
	@GetMapping
	public List<Question> getAllQuestion() {
		return service.getAllQuestion();
		
	}
	
	@GetMapping("/{id}")
	public Question getQuestionById(@PathVariable Long id) {
		return service.getQuestionById(id);
	}
	
	@GetMapping("/topic/{topic}")
	public List<Question> getByTopic(@PathVariable Topic topic) {
		return service.getByTopic(topic) ;
	}
	
	@GetMapping("/difficulty/{difficulty}")
	public List<Question> getByDifficulty(@PathVariable Difficulty difficulty) {
		return service.getByDifficulty(difficulty);
	}
	
	@GetMapping("/search")
	public List<Question> search(@RequestParam Topic topic, @RequestParam Difficulty difficulty) {
		
		return service.getByTopicAndDifficulty(topic, difficulty);
	}
	
	
	@PutMapping("/{id}")
	public Question update(@PathVariable Long id, @RequestBody Question question) {
		return service.updateQuestion(id, question) ;
	}
	
	@DeleteMapping("/{id}")
	public void delete(@PathVariable Long id) {
		service.deleteQuestion(id);
	}
	
	


}
