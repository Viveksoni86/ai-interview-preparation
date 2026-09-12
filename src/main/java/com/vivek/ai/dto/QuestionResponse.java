package com.vivek.ai.dto;

import com.vivek.ai.entity.Topic;
import com.vivek.ai.entity.Difficulty;

import lombok.Data;
import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuestionResponse {
	
	private Long id;
	private String question;
	private String answer;
	private Topic topic;
	private Difficulty difficulty;

}
