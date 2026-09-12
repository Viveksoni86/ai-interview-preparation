package com.vivek.ai.ai.service;

import org.springframework.stereotype.Service; 
import org.springframework.beans.factory.annotation.Value ;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse ;


@Service
public class GeminiAIService implements AIService {
	
	private final Client client ;
	
	@Value("${gemini.model}")
	private String model;
	
	public GeminiAIService(Client client ) {
		this.client = client ;
	}
	
	@Override
	public String chat(String prompt) {
		
		try {
			
			GenerateContentResponse response = 
					client.models.generateContent(
							model,
							prompt,
							null);
			
			
		return response.text();
		}
		catch(Exception e) {
			return "Error : " + e.getMessage();
		}
		
		
		
		
	}


}
