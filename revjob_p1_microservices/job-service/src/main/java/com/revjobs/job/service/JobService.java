package com.revjobs.job.service;

import com.revjobs.common.dto.UserDTO;
import com.revjobs.common.exception.ResourceNotFoundException;
import com.revjobs.job.client.UserServiceClient;
import com.revjobs.job.model.Job;
import com.revjobs.job.model.JobStatus;
import com.revjobs.job.repository.JobRepository;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class JobService {

    private final JobRepository jobRepository;
    private final UserServiceClient userServiceClient;

    @Transactional
    public Job createJob(Job job) {
        // Validate recruiter using circuit breaker
        validateRecruiter(job.getRecruiterId());
        return jobRepository.save(job);
    }

    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    public List<Job> getActiveJobs() {
        return jobRepository.findByStatus(JobStatus.ACTIVE);
    }

    public Job getJobById(Long id) {
        return jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));
    }

    public List<Job> getJobsByRecruiterId(Long recruiterId) {
        return jobRepository.findByRecruiterId(recruiterId);
    }

    @Transactional
    public Job updateJob(Long id, Job jobDetails) {
        Job job = getJobById(id);
        
        job.setTitle(jobDetails.getTitle());
        job.setDescription(jobDetails.getDescription());
        job.setCompanyName(jobDetails.getCompanyName());
        job.setLocation(jobDetails.getLocation());
        job.setRemote(jobDetails.getRemote());
        job.setRequirements(jobDetails.getRequirements());
        job.setApplicationDeadline(jobDetails.getApplicationDeadline());
        job.setSalaryMin(jobDetails.getSalaryMin());
        job.setSalaryMax(jobDetails.getSalaryMax());
        job.setExperienceLevel(jobDetails.getExperienceLevel());
        job.setStatus(jobDetails.getStatus());
        
        return jobRepository.save(job);
    }

    @Transactional
    public void deleteJob(Long id) {
        Job job = getJobById(id);
        jobRepository.delete(job);
    }

    @CircuitBreaker(name = "userService", fallbackMethod = "validateRecruiterFallback")
    @Retry(name = "userService")
    private void validateRecruiter(Long recruiterId) {
        log.info("Validating recruiter with id: {}", recruiterId);
        try {
            UserDTO user = userServiceClient.getUserById(recruiterId).getData();
            if (user == null || !"RECRUITER".equals(user.getRole())) {
                throw new ResourceNotFoundException("Invalid recruiter");
            }
        } catch (Exception e) {
            log.error("Error validating recruiter: {}", e.getMessage());
            throw new ResourceNotFoundException("Unable to validate recruiter");
        }
    }

    private void validateRecruiterFallback(Long recruiterId, Exception e) {
        log.warn("Circuit breaker activated for recruiter validation. Proceeding without validation.");
        // In production, you might want to queue this for later verification
        // or implement a different fallback strategy
    }
}

