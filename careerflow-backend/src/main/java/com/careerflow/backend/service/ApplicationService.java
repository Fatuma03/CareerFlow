package com.careerflow.backend.service;

import org.springframework.stereotype.Service;
import com.careerflow.backend.repository.ApplicationRepository;
import com.careerflow.backend.model.Application;
import org.springframework.data.domain.Sort;
import java.util.List;
import java.util.Optional;

@Service
public class ApplicationService {
    private final ApplicationRepository applicationRepository;

    public ApplicationService(ApplicationRepository applicationRepository) {
        this.applicationRepository = applicationRepository;
    }

    public Application createApplication(Application application) {
        application.setStatus("Applied");
        return applicationRepository.save(application);
    }

    public List<Application> getAllApplications() {
        return applicationRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
    }

    public Optional<Application> getApplicationById(Long id) {
        return applicationRepository.findById(id);
    }

    public Optional<Application> updateApplication(Long id, Application updatedApplication) {
        Optional<Application> existingApplication = applicationRepository.findById(id);
        if (existingApplication.isPresent()) {
            Application application = existingApplication.get();
            application.setCompany(updatedApplication.getCompany());
            application.setRole(updatedApplication.getRole());
            application.setDateApplied(updatedApplication.getDateApplied());
            application.setStatus(updatedApplication.getStatus());
            application.setFollowUpDate(updatedApplication.getFollowUpDate());
            application.setJobUrl(updatedApplication.getJobUrl());
            application.setNotes(updatedApplication.getNotes());

            Application saveApplication = applicationRepository.save(application);
            return Optional.of(saveApplication);
        }
        return Optional.empty();

    }
    public boolean deleteApplication(Long id){
        Optional<Application> application = applicationRepository.findById(id);
        if(application.isPresent()){
            applicationRepository.delete(application.get());
            return true;
        }
        return false;
    }
}
