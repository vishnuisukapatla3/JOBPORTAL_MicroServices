package com.revjobs.job.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "jobs", 
       indexes = {
           @Index(name = "idx_job_status", columnList = "status"),
           @Index(name = "idx_job_recruiter_id", columnList = "recruiter_id"),
           @Index(name = "idx_job_posted_date", columnList = "postedDate")
       })
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 200)
    private String title;
    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;
    
    @Column(nullable = false, length = 200)
    private String companyName;
    
    @Column(nullable = false, length = 200)
    private String location;
    
    @Column(nullable = false)
    private Boolean remote = false;
    
    @ElementCollection
    @CollectionTable(name = "job_requirements", joinColumns = @JoinColumn(name = "job_id"))
    @Column(name = "requirement")
    private List<String> requirements;
    
    private String applicationDeadline;
    
    private Double salaryMin;
    private Double salaryMax;
    
    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private ExperienceLevel experienceLevel;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private JobStatus status = JobStatus.ACTIVE;
    
    @Column(name = "recruiter_id", nullable = false)
    private Long recruiterId;
    
    @Column(updatable = false)
    private LocalDateTime postedDate;
    
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        postedDate = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = JobStatus.ACTIVE;
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

