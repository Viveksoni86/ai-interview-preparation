package com.vivek.ai.resume.prompt;

public class ResumePrompt {

    public static String analyzeResume(String resumeText) {

        return """
You are an expert ATS Resume Reviewer.

Analyze the following resume.

Return ONLY valid JSON.

Do not use markdown.
Do not use ```json.
Do not add explanations outside the JSON.

Use exactly this structure:

{
  "atsScore": 0,
  "strengths": [],
  "weaknesses": [],
  "missingSkills": [],
  "interviewReadiness": "",
  "suggestions": []
}

Rules:

1. atsScore must be between 0 and 100.
2. strengths must contain important strengths found in the resume.
3. weaknesses must contain actual weaknesses.
4. missingSkills should contain relevant skills that appear to be missing.
5. interviewReadiness should be "Excellent", "Good", "Average", or "Needs Improvement".
6. suggestions should contain practical improvements.
7. Do not invent experience that is not present in the resume.

Resume:

%s
""".formatted(resumeText);
    }
}