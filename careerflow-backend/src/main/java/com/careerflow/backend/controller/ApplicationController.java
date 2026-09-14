package com.careerflow.backend.controller;

import org.springframework.web.bind.annotation.RestController;
import com.careerflow.backend.service.ApplicationService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import com.careerflow.backend.model.Application;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class ApplicationController {
    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping("/applications")
    public Application createApplication(@RequestBody Application application) {
        return applicationService.createApplication(application);
    }

    @GetMapping("/applications")
    public List<Application> getAllApplications() {
        return applicationService.getAllApplications();
    }

    @GetMapping("/applications/{id}")
    public ResponseEntity<Application> getApplicationById(@PathVariable Long id) {
        Optional<Application> application = applicationService.getApplicationById(id);
        if (application.isPresent()) {
            return ResponseEntity.ok(application.get());
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/applications/{id}")
    public ResponseEntity<Application> updateApplication(@PathVariable Long id,
            @RequestBody Application updatedApplication) {
        Optional<Application> application = applicationService.updateApplication(id, updatedApplication);
        if (application.isPresent()) {
            return ResponseEntity.ok(application.get());
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/applications/{id}")
    public ResponseEntity<Void> deleteApplication(@PathVariable Long id) {
        boolean deleted = applicationService.deleteApplication(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
