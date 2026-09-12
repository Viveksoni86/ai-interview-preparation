package com.vivek.ai.resume.service ;

import org.springframework.stereotype.Service ;

import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vivek.ai.resume.dto.ResumeAnalysisResponse;
import com.vivek.ai.ai.service.AIService; 
import com.vivek.ai.resume.prompt.ResumePrompt;
import com.vivek.ai.resume.util.PdfUtil; 

@Service
public class ResumeService {
	
	private final AIService aiService;
	
	private final ObjectMapper objectMapper ;
	
	
	
	public ResumeService(AIService aiService , ObjectMapper objectMapper) {
		this.aiService = aiService ;
		this.objectMapper = objectMapper ;
		
		
	}
	
	public ResumeAnalysisResponse analyzeResume(MultipartFile file) throws Exception {
		
		if (file == null || file.isEmpty()) {
			throw new IllegalArgumentException("Resume file cannot be empty");
		}
		
		String filename = file.getOriginalFilename() != null ? file.getOriginalFilename().toLowerCase() : "";
		String contentType = file.getContentType() != null ? file.getContentType().toLowerCase() : "";
		
		if (!filename.endsWith(".pdf") && !contentType.contains("pdf")) {
			throw new IllegalArgumentException("Only PDF files are supported");
		}
		
		String resumeText = PdfUtil.extractText(file);
		String prompt = ResumePrompt.analyzeResume(resumeText);
		
		String aiResponse = aiService.chat(prompt);
		
		if (aiResponse == null || aiResponse.isBlank() || aiResponse.startsWith("Error")) {
			throw new RuntimeException("AI service failed to analyze resume: " + aiResponse);
		}
		
		String jsonText = aiResponse.trim();
		int start = jsonText.indexOf('{');
		int end = jsonText.lastIndexOf('}');
		if (start != -1 && end != -1 && end > start) {
			jsonText = jsonText.substring(start, end + 1);
		}
		
		return objectMapper.readValue(
				jsonText,
				ResumeAnalysisResponse.class);
	}
	
	
}


