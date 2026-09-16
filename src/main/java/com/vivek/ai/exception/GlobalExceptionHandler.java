package com.vivek.ai.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;


@RestControllerAdvice
public class GlobalExceptionHandler {
	
	@ExceptionHandler(MethodArgumentNotValidException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	public Map<String,String> handleValidation(MethodArgumentNotValidException ex) {
		
		Map<String,String> errors = new HashMap<>();
		
		ex.getBindingResult().getFieldErrors().forEach(error -> {
			
			errors.put (
					error.getField(),
			        error.getDefaultMessage());
		});
		
		return errors ;
		
		
		
	}
	
	@ExceptionHandler(Exception.class)
	@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
	public Map<String,String> handleException(Exception ex) {
		Map<String,String> error = new HashMap<>();
		error.put("error", ex.getMessage());
		return error;
	}

}
