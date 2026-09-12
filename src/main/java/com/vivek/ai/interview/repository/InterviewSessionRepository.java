package com.vivek.ai.interview.repository;

import org.springframework.data.jpa.repository.JpaRepository ;
import com.vivek.ai.interview.entity.InterviewSession ;

public interface InterviewSessionRepository  extends JpaRepository<InterviewSession , Long>{

}
