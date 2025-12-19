package com.revjobs.common.saga;

public enum SagaStatus {
    STARTED,
    APPLICATION_CREATED,
    NOTIFICATION_SENT,
    COMPLETED,
    FAILED,
    COMPENSATING,
    COMPENSATED
}

