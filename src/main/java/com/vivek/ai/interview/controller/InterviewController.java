package com.vivek.ai.interview.controller;

import org.springframework.web.bind.annotation.*;

import com.vivek.ai.interview.dto.*;
import com.vivek.ai.interview.Service.InterviewService ;


@RestController
@RequestMapping("/api/interview")
public class InterviewController {
	
	private final InterviewService service ;
	
	public InterviewController(InterviewService service) {
		this.service = service ;
		
	}
	
	@PostMapping("/start")
	public InterviewResponse start(@RequestBody StartInterviewRequest request) {
		String response = service.startInterview(request.getTopic(), request.getDifficulty());
		
		return new InterviewResponse(response);
	}
	
	@PostMapping("/answer")
	public InterviewResponse answer(@RequestBody AnswerRequest request) {
		String response = service.evaluateAnswer(request.getQuestion(),
				request.getAnswer());
		
		return new InterviewResponse(response);
	}

}
