package com.vivek.ai.ai.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AIResponse {

	private String response ;
	
	public String getAnswer() {
		return response;
	}
	
	public void setAnswer(String answer) {
		this.response = answer;
	}
}
