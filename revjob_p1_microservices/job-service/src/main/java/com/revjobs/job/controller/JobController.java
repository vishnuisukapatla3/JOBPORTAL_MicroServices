package com.revjobs.job.controller;

import com.revjobs.common.dto.ApiResponse;
import com.revjobs.job.model.Job;
import com.revjobs.job.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    @PostMapping
    public ResponseEntity<ApiResponse<Job>> createJob(@RequestBody Job job) {
        Job created = jobService.createJob(job);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Job created successfully", created));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Job>>> getAllJobs() {
        List<Job> jobs = jobService.getAllJobs();
        return ResponseEntity.ok(ApiResponse.success(jobs));
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<Job>>> getActiveJobs() {
        List<Job> jobs = jobService.getActiveJobs();
        return ResponseEntity.ok(ApiResponse.success(jobs));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Job>> getJobById(@PathVariable Long id) {
        Job job = jobService.getJobById(id);
        return ResponseEntity.ok(ApiResponse.success(job));
    }

    @GetMapping("/recruiter/{recruiterId}")
    public ResponseEntity<ApiResponse<List<Job>>> getJobsByRecruiterId(@PathVariable Long recruiterId) {
        List<Job> jobs = jobService.getJobsByRecruiterId(recruiterId);
        return ResponseEntity.ok(ApiResponse.success(jobs));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Job>> updateJob(@PathVariable Long id, @RequestBody Job job) {
        Job updated = jobService.updateJob(id, job);
        return ResponseEntity.ok(ApiResponse.success("Job updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteJob(@PathVariable Long id) {
        jobService.deleteJob(id);
        return ResponseEntity.ok(ApiResponse.success("Job deleted successfully", null));
    }
}

