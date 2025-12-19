package com.revjobs.common.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationCreatedEvent {
    private Long applicationId;
    private Long jobId;
    private Long applicantId;
    private String applicantEmail;
    private LocalDateTime timestamp;
}

