package com.vivek.ai.interview.prompt;



public class InterviewPromptBuilder {
	
	public static String generateQuestion(String topic , String difficulty) {
		
		        return """
		You are a Senior Technical Interviewer.

		Generate ONE interview question.

		Topic : %s

		Difficulty : %s

		Return only the question.
		"""
		.formatted(topic, difficulty);

		    }

		    public static String evaluateAnswer(String question,
		                                        String answer){

		        return """
		You are a Senior Software Interviewer.

		Question:

		%s

		Candidate Answer:

		%s

		Evaluate using the following format:

		Score: X/10

		Strengths:

		Weaknesses:

		Correct Answer:

		Improvement Tips:
		"""
		.formatted(question, answer);

		    }

		
	}


