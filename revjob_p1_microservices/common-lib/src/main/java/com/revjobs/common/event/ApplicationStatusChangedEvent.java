package com.revjobs.common.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationStatusChangedEvent {
    private Long applicationId;
    private String oldStatus;
    private String newStatus;
    private Long applicantId;
    private Long recruiterId;
    private LocalDateTime timestamp;
}

