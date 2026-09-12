package com.vivek.ai.ai.dto;

import lombok.*;


@Data
public class GenerateQuestionRequest {

	
	private String topic;
	
	private String difficulty;
	
	private int count ;
}
