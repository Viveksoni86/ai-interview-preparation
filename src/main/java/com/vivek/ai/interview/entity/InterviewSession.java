package com.vivek.ai.interview.entity;

import java.time.LocalDateTime;
import java.util.List;


import jakarta.persistence.*;

@Entity
@Table(name = "interview_session")
public class InterviewSession {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id ;
	
	
	private String topic ;
	
	private String userName;
	
	private String difficulty ;
	
	@Enumerated(EnumType.STRING)
	private InterviewStatus status ;
	
	private LocalDateTime startAt ;
	
	private LocalDateTime endedAt;
	
	private double totalScore;
	
	@OneToMany(mappedBy = "session",
			   cascade = CascadeType.ALL)
	private List<InterviewAnswer> answers ;
	
	public InterviewSession() {
		
	}
	
	
	
	

}
