package com.vivek.ai.ai.controller;

import org.springframework.web.bind.annotation.*;
import com.vivek.ai.ai.service.AIService ;
import com.vivek.ai.ai.dto.AIResponse;
import com.vivek.ai.ai.prompt.InterviewPrompt;
import com.vivek.ai.ai.dto.AIRequest;
import com.vivek.ai.ai.dto.GenerateQuestionRequest; 


@RestController
@RequestMapping("/api/ai")
public class AIController {
	
	private final AIService aiService;
	
	public AIController(AIService aiService) {
		this.aiService = aiService ;
		
	}
	
	@PostMapping("/chat")
	public AIResponse chat(@RequestBody AIRequest request) {
		
		String answer =  aiService.chat(request.getPrompt());
		
		return new AIResponse(answer);
		
	}
	
	@PostMapping("/explain")
	public AIResponse explain(@RequestBody AIRequest request) {
		
		String answer = aiService.chat(
				InterviewPrompt.explain(
						request.getPrompt()));
		
		return new AIResponse(answer);
	}
	
	@PostMapping("/generate")
	public AIResponse generate(@RequestBody GenerateQuestionRequest request) {
		
		String prompt = InterviewPrompt.generateQuestion(
				request.getTopic(),
				request.getDifficulty(),
				request.getCount());
		
		String answer = aiService.chat(prompt) ;
		
		return new AIResponse(answer);
		
		
	}
	

	
	
	
}
