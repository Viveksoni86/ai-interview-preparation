package com.vivek.ai.resume.dto;

import lombok.*;
import java.util.List ;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ResumeAnalysisResponse {
	
	
	
	 private int atsScore;

	    private List<String> strengths;

	    private List<String> weaknesses;

	    private List<String> missingSkills;

	    private String interviewReadiness;

	    private List<String> suggestions;

}
