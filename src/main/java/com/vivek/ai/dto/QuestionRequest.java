package com.vivek.ai.dto;

import com.vivek.ai.entity.Difficulty;
import com.vivek.ai.entity.Topic; 

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionRequest {
	
	@NotBlank(message = "question cannot be empty")
	private String question ;
	
	@NotBlank(message = "question cannot be empty")
	private String answer;
	
	@NotNull(message = "Topic is required")
	private Topic topic ;
	
	@NotNull(message = "Difficulty is required")
	private Difficulty difficulty ;

}
