package com.vivek.ai.resume.controller ;

import org.springframework.http.MediaType;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile ;

import com.vivek.ai.resume.dto.ResumeAnalysisResponse;
import com.vivek.ai.resume.service.ResumeService; ;


@RestController
@RequestMapping("/api/resume")
public class ResumeController {
	
	private final ResumeService service ;
	
	public ResumeController(ResumeService service) {
		this.service = service ;
		
	}
	
	@PostMapping(value = "/analyze", 
			consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResumeAnalysisResponse analyze(@RequestParam("file") MultipartFile file) throws Exception {
		
		return service.analyzeResume(file);
	}
}

