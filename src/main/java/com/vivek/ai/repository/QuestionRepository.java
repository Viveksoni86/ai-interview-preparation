package com.vivek.ai.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.vivek.ai.entity.Question;
import com.vivek.ai.entity.Topic;
import com.vivek.ai.entity.Difficulty;

public interface QuestionRepository
        extends JpaRepository<Question, Long> {

    List<Question> findByTopic(Topic topic);

    List<Question> findByDifficulty(Difficulty difficulty);

    List<Question> findByTopicAndDifficulty(
            Topic topic,
            Difficulty difficulty
    );
}