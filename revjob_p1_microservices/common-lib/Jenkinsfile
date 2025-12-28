pipeline {
    agent any

    triggers {
        githubPush()
        pollSCM('H/5 * * * *')
    }

    tools {
        maven 'Maven 3' // Ensure this matches your Global Tool Configuration in Jenkins
        jdk 'JDK 17'    // Ensure this matches your Global Tool Configuration in Jenkins
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build & Install') {
            steps {
                // Installs the library to the local Jenkins Maven repo (.m2)
                // This allows other services (User, Job, etc.) to find it when they build.
                bat 'mvn clean install -DskipTests' 
            }
        }
    }
}
