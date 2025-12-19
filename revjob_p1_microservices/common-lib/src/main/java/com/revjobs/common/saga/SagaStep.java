package com.revjobs.common.saga;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SagaStep {
    private String stepName;
    private SagaStatus status;
    private String errorMessage;
    private LocalDateTime timestamp;

    public SagaStep(String stepName, SagaStatus status) {
        this.stepName = stepName;
        this.status = status;
        this.timestamp = LocalDateTime.now();
    }
}

