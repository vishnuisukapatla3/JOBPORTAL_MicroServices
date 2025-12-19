#!/bin/bash

# RevJobs Microservices Startup Script

echo "=================================="
echo "RevJobs Microservices Architecture"
echo "=================================="
echo ""

# Check if Maven is installed
if ! command -v mvn &> /dev/null; then
    echo "Error: Maven is not installed. Please install Maven first."
    exit 1
fi

# Check if Java 21 is installed
if ! command -v java &> /dev/null; then
    echo "Error: Java is not installed. Please install Java 21 first."
    exit 1
fi

echo "Building all services..."
echo ""

# Build common library first
echo "Building common-lib..."
cd common-lib
mvn clean install -DskipTests
cd ..

# Start Config Server first
echo "Starting Config Server..."
cd config-server
mvn spring-boot:run &
CONFIG_PID=$!
cd ..
echo "Config Server started (PID: $CONFIG_PID)"
sleep 20

# Start Discovery Server
echo "Starting Discovery Server..."
cd discovery-server
mvn spring-boot:run &
DISCOVERY_PID=$!
cd ..
echo "Discovery Server started (PID: $DISCOVERY_PID)"
sleep 20

# Start API Gateway
echo "Starting API Gateway..."
cd api-gateway
mvn spring-boot:run &
GATEWAY_PID=$!
cd ..
echo "API Gateway started (PID: $GATEWAY_PID)"
sleep 15

# Start User Service
echo "Starting User Service..."
cd user-service
mvn spring-boot:run &
USER_PID=$!
cd ..
echo "User Service started (PID: $USER_PID)"
sleep 15

# Start Job Service
echo "Starting Job Service..."
cd job-service
mvn spring-boot:run &
JOB_PID=$!
cd ..
echo "Job Service started (PID: $JOB_PID)"
sleep 15

# Start Application Service
echo "Starting Application Service..."
cd application-service
mvn spring-boot:run &
APP_PID=$!
cd ..
echo "Application Service started (PID: $APP_PID)"
sleep 15

# Start Message Service
echo "Starting Message Service..."
cd message-service
mvn spring-boot:run &
MSG_PID=$!
cd ..
echo "Message Service started (PID: $MSG_PID)"
sleep 15

# Start Notification Service
echo "Starting Notification Service..."
cd notification-service
mvn spring-boot:run &
NOTIF_PID=$!
cd ..
echo "Notification Service started (PID: $NOTIF_PID)"

echo ""
echo "=================================="
echo "All services started successfully!"
echo "=================================="
echo ""
echo "Service URLs:"
echo "  Config Server:       http://localhost:8888"
echo "  Discovery Server:    http://localhost:8761"
echo "  API Gateway:         http://localhost:8080"
echo "  User Service:        http://localhost:8081"
echo "  Job Service:         http://localhost:8082"
echo "  Application Service: http://localhost:8083"
echo "  Message Service:     http://localhost:8084"
echo "  Notification Service: http://localhost:8085"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Save PIDs to file for shutdown
echo "$CONFIG_PID $DISCOVERY_PID $GATEWAY_PID $USER_PID $JOB_PID $APP_PID $MSG_PID $NOTIF_PID" > .service_pids

# Wait for user interrupt
wait

