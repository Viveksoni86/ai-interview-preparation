package com.vivek.ai.interview.Service;

import org.springframework.stereotype.Service ;

import com.vivek.ai.ai.service.AIService;
import com.vivek.ai.interview.prompt.InterviewPromptBuilder;  


@Service
public class InterviewService {
	
	private final AIService aiService ;
	
	public InterviewService(AIService aiService) {
		this.aiService = aiService ;
			
	}
	
	public String startInterview(String topic , String difficulty) {
		
		String prompt = InterviewPromptBuilder.generateQuestion(topic , difficulty);
		
		return aiService.chat(prompt);
	}	

	public String evaluateAnswer(String question , String answer) {
		 String prompt = InterviewPromptBuilder.evaluateAnswer(question  , answer);
		 
		 return aiService.chat(prompt);
	}
}
