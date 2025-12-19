package com.revjobs.job.repository;

import com.revjobs.job.model.Job;
import com.revjobs.job.model.JobStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByStatus(JobStatus status);
    List<Job> findByRecruiterId(Long recruiterId);
    List<Job> findByStatusAndRecruiterId(JobStatus status, Long recruiterId);
}

