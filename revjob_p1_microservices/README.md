# RevJobs Microservices Architecture

A complete microservices-based job portal application with modern enterprise patterns and best practices.

## 🏗️ Architecture Overview

This project demonstrates a production-ready microservices architecture with:

- **Config Server**: Centralized configuration management
- **Discovery Server**: Service discovery using Eureka
- **API Gateway**: Single entry point with JWT authentication
- **User Service**: User management with OAuth2 and JWT
- **Job Service**: Job posting management with Circuit Breaker pattern
- **Application Service**: Job application handling with Saga pattern
- **Message Service**: Real-time messaging with WebSockets
- **Notification Service**: Notification management

## 🎯 Key Features

### Microservices Patterns
- ✅ **Service Discovery**: Eureka for dynamic service registration
- ✅ **API Gateway**: Centralized routing and authentication
- ✅ **Config Server**: Externalized configuration
- ✅ **Circuit Breaker**: Resilience4j for fault tolerance
- ✅ **Saga Pattern**: Distributed transaction management
- ✅ **Event-Driven**: Asynchronous communication

### Security
- ✅ **JWT Authentication**: Secure token-based auth
- ✅ **OAuth2**: Social login support (Google, GitHub)
- ✅ **Authorization**: Role-based access control
- ✅ **Token Management**: Secure token storage and validation

### Communication
- ✅ **REST APIs**: Synchronous communication
- ✅ **WebSockets**: Real-time messaging
- ✅ **Feign Clients**: Inter-service communication

### Testing
- ✅ **Integration Tests**: Comprehensive test coverage
- ✅ **Mock MVC**: Controller testing
- ✅ **Test Profiles**: Isolated test environments

## 📋 Prerequisites

- Java 21 or higher
- Maven 3.8+
- MySQL 8.0+
- Docker (optional, for containerized deployment)

## 🚀 Getting Started

### Option 1: Local Development

#### 1. Setup MySQL Databases

Create the following databases:
```sql
CREATE DATABASE revjobs_users;
CREATE DATABASE revjobs_jobs;
CREATE DATABASE revjobs_applications;
CREATE DATABASE revjobs_messages;
CREATE DATABASE revjobs_notifications;
```

#### 2. Configure Database Credentials

Update the database password in config files:
- `config-server/src/main/resources/config/*.yml`

#### 3. Start All Services

**On Linux/Mac:**
```bash
chmod +x start-all-services.sh
./start-all-services.sh
```

**On Windows:**
```cmd
start-all-services.bat
```

#### 4. Verify Services

- Config Server: http://localhost:8888
- Discovery Server: http://localhost:8761
- API Gateway: http://localhost:8080
- User Service: http://localhost:8081
- Job Service: http://localhost:8082
- Application Service: http://localhost:8083
- Message Service: http://localhost:8084
- Notification Service: http://localhost:8085

### Option 2: Docker Deployment

#### 1. Build and Start Services

```bash
docker-compose up --build
```

#### 2. Stop Services

```bash
docker-compose down
```

#### 3. Stop and Remove Volumes

```bash
docker-compose down -v
```

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "JOB_SEEKER"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Job Endpoints

#### Create Job (Requires RECRUITER role)
```http
POST /api/jobs
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Software Engineer",
  "description": "We are looking for...",
  "companyName": "Tech Corp",
  "location": "San Francisco",
  "remote": true,
  "requirements": ["Java", "Spring Boot"],
  "salaryMin": 80000,
  "salaryMax": 120000,
  "experienceLevel": "INTERMEDIATE"
}
```

#### Get All Active Jobs
```http
GET /api/jobs/active
Authorization: Bearer <token>
```

### Application Endpoints

#### Apply for Job
```http
POST /api/applications
Authorization: Bearer <token>
Content-Type: application/json

{
  "applicantId": 1,
  "applicantEmail": "john@example.com",
  "jobId": 1,
  "coverLetter": "I am interested in..."
}
```

#### Get My Applications
```http
GET /api/applications/applicant/{applicantId}
Authorization: Bearer <token>
```

### Message Endpoints

#### Send Message
```http
POST /api/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "senderId": 1,
  "receiverId": 2,
  "content": "Hello!"
}
```

#### Get Conversation
```http
GET /api/messages/conversation?user1Id=1&user2Id=2
Authorization: Bearer <token>
```

### Notification Endpoints

#### Get User Notifications
```http
GET /api/notifications/user/{userId}
Authorization: Bearer <token>
```

#### Get Unread Count
```http
GET /api/notifications/user/{userId}/unread-count
Authorization: Bearer <token>
```

## 🧪 Running Tests

### Run All Tests
```bash
mvn clean test
```

### Run Tests for Specific Service
```bash
cd user-service
mvn test
```

## 🏛️ Architecture Patterns

### 1. Saga Pattern (Application Service)
The Application Service implements the Saga pattern for distributed transactions:
- Application creation
- User validation
- Job validation
- Notification sending
- Compensation on failure

### 2. Circuit Breaker (Job Service)
The Job Service uses Resilience4j for fault tolerance:
- User service validation with fallback
- Automatic circuit opening on failures
- Retry mechanism

### 3. API Gateway Security
JWT-based authentication at the gateway level:
- Token validation
- User context propagation
- Role-based routing

### 4. WebSocket Communication
Real-time messaging using STOMP over WebSocket:
- User-to-user messaging
- Presence detection
- Unread message tracking

## 🗂️ Project Structure

```
revjob_p1_microservices/
├── common-lib/              # Shared DTOs, exceptions, utilities
├── config-server/           # Centralized configuration
├── discovery-server/        # Eureka service registry
├── api-gateway/            # API Gateway with security
├── user-service/           # User management + OAuth2
├── job-service/            # Job management + Circuit Breaker
├── application-service/    # Job applications + Saga
├── message-service/        # Messaging + WebSockets
├── notification-service/   # Notifications
├── docker-compose.yml      # Docker deployment
└── start-all-services.*    # Startup scripts
```

## 🔧 Configuration

### Config Server
All service configurations are centralized in:
```
config-server/src/main/resources/config/
├── api-gateway.yml
├── user-service.yml
├── job-service.yml
├── application-service.yml
├── message-service.yml
└── notification-service.yml
```

### Database Configuration
Each service uses its own database:
- **user-service**: revjobs_users
- **job-service**: revjobs_jobs
- **application-service**: revjobs_applications
- **message-service**: revjobs_messages
- **notification-service**: revjobs_notifications

## 📊 Monitoring

### Eureka Dashboard
Access the service registry dashboard:
```
http://localhost:8761
```

### Actuator Endpoints
All services expose actuator endpoints:
```
http://localhost:<port>/actuator/health
http://localhost:<port>/actuator/info
```

## 🚨 Troubleshooting

### Services Not Starting
1. Check if ports are available (8080-8085, 8761, 8888)
2. Verify MySQL is running
3. Check Java version: `java -version`
4. Ensure Maven is installed: `mvn -version`

### Database Connection Issues
1. Verify MySQL credentials in config files
2. Ensure databases are created
3. Check MySQL is accessible on localhost:3306

### Service Discovery Issues
1. Wait for Discovery Server to fully start (20-30 seconds)
2. Check Eureka dashboard at http://localhost:8761
3. Verify network connectivity between services

## 📝 License

This project is created for educational purposes as part of the RevJobs platform.

## 👥 Contributing

This is a learning project. Feel free to fork and experiment!

## 📧 Contact

For questions or issues, please create an issue in the repository.

