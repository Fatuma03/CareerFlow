package com.careerflow.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.careerflow.backend.model.Application;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

}
