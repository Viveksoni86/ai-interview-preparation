package com.vivek.ai.entity;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor		
@Builder
@Table(name = "question")
public class Question {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(length = 5000)
	private String question ;
	
	@Column(length = 5000)
	private String answer ;
	
	@Enumerated(EnumType.STRING) 
	private Topic topic;
	
	@Enumerated(EnumType.STRING)
	private Difficulty difficulty;
	
	
	

	
	

	
	
}
