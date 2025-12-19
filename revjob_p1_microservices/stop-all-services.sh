#!/bin/bash

# Stop all RevJobs microservices

echo "Stopping all RevJobs microservices..."

if [ -f .service_pids ]; then
    read -r PIDS < .service_pids
    for PID in $PIDS; do
        if ps -p $PID > /dev/null; then
            echo "Stopping process $PID..."
            kill $PID
        fi
    done
    rm .service_pids
    echo "All services stopped."
else
    echo "No running services found."
    echo "Attempting to kill all Spring Boot processes..."
    pkill -f "spring-boot:run"
fi

echo "Done."

