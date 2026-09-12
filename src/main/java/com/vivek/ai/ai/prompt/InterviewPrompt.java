package com.vivek.ai.ai.prompt;

public class InterviewPrompt {
	
	public static String explain(String topic) {
		
		 return """
				 You are an expert Java Interview Trainer.

				Explain:
				
				%s
				
				Requirements:
				
				1. Beginner Friendly
				2. Real Examples
				3. Interview Tips
				4. Common Mistakes
				5. Short Summary
				 """.formatted(topic);
	
	}
	
	public static String generateQuestion(String topic , String difficulty , int count) {
		  return """
				  Generate %d %s interview questions on %s.

				  Return only the questions.

				  No explanations.
				  """.formatted(count,difficulty,topic);

		
	}

}
