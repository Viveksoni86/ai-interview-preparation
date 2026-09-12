package com.vivek.ai.interview.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "interview_answers")
public class InterviewAnswer {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id ;
	
	@Column(length = 3000)
	private String question ;
	
	@Column(length = 5000)
	private String answer ;
	
	@Column(length = 5000)
	private String feedback ;  
	
	private Double score;
	
	@ManyToOne
	@JoinColumn(name = "session_id")
	private InterviewSession session ;
	
	private InterviewAnswer() {
		
	}
}
