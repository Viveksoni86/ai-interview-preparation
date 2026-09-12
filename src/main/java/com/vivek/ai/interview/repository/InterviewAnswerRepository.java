package com.vivek.ai.interview.repository;

import org.springframework.data.jpa.repository.JpaRepository ;

import com.vivek.ai.interview.entity.InterviewAnswer; ;

public interface InterviewAnswerRepository extends JpaRepository<InterviewAnswer , Long>  {

}
