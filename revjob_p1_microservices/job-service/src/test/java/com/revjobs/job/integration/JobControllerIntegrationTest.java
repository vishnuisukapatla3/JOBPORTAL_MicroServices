package com.revjobs.job.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.revjobs.job.model.ExperienceLevel;
import com.revjobs.job.model.Job;
import com.revjobs.job.model.JobStatus;
import com.revjobs.job.repository.JobRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class JobControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private JobRepository jobRepository;

    @BeforeEach
    public void setup() {
        jobRepository.deleteAll();
    }

    @Test
    public void testCreateJob_Success() throws Exception {
        Job job = new Job();
        job.setTitle("Software Engineer");
        job.setDescription("We are looking for a software engineer");
        job.setCompanyName("Tech Corp");
        job.setLocation("San Francisco");
        job.setRemote(true);
        job.setRequirements(Arrays.asList("Java", "Spring Boot", "MySQL"));
        job.setSalaryMin(80000.0);
        job.setSalaryMax(120000.0);
        job.setExperienceLevel(ExperienceLevel.INTERMEDIATE);
        job.setStatus(JobStatus.ACTIVE);
        job.setRecruiterId(1L);

        mockMvc.perform(post("/jobs")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(job)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.title").value("Software Engineer"));
    }

    @Test
    public void testGetAllJobs() throws Exception {
        // Create test jobs
        Job job1 = new Job();
        job1.setTitle("Software Engineer");
        job1.setDescription("Description 1");
        job1.setCompanyName("Tech Corp");
        job1.setLocation("San Francisco");
        job1.setRemote(true);
        job1.setRecruiterId(1L);
        jobRepository.save(job1);

        Job job2 = new Job();
        job2.setTitle("Data Scientist");
        job2.setDescription("Description 2");
        job2.setCompanyName("Data Inc");
        job2.setLocation("New York");
        job2.setRemote(false);
        job2.setRecruiterId(1L);
        jobRepository.save(job2);

        mockMvc.perform(get("/jobs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.length()").value(2));
    }

    @Test
    public void testGetJobById_Success() throws Exception {
        Job job = new Job();
        job.setTitle("Software Engineer");
        job.setDescription("Description");
        job.setCompanyName("Tech Corp");
        job.setLocation("San Francisco");
        job.setRemote(true);
        job.setRecruiterId(1L);
        Job saved = jobRepository.save(job);

        mockMvc.perform(get("/jobs/" + saved.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.title").value("Software Engineer"));
    }

    @Test
    public void testGetJobById_NotFound() throws Exception {
        mockMvc.perform(get("/jobs/999"))
                .andExpect(status().isNotFound());
    }
}

