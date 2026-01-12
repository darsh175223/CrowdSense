pipeline {
    agent any

    environment {
        // Define any environment variables here
        JAVA_HOME = tool name: 'jdk-17', type: 'hudson.model.JDK' // Adjust tool name as per your Jenkins config
        NODEJS_HOME = tool name: 'node-18', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation' // Adjust tool name
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Frontend') {
            steps {
                dir('angular-frontend') {
                    // Install dependencies and build
                    // Use 'bat' for Windows agents, 'sh' for Linux. 
                    // Uncomment the appropriate line based on your Jenkins agent OS.
                    
                    // Linux:
                    sh 'npm install'
                    sh 'npm run build -- --configuration production'
                    
                    // Windows:
                    // bat 'npm install'
                    // bat 'npm run build -- --configuration production'
                }
            }
        }

        stage('Build Backend') {
            steps {
                dir('SpringBootBackend/SpringBootBackend') {
                    // Grant execution permission for gradlew (Linux/Mac)
                    sh 'chmod +x gradlew'
                    
                    // Build the project
                    // Linux:
                    sh './gradlew clean build -x test' 
                    
                    // Windows:
                    // bat 'gradlew.bat clean build -x test'
                }
            }
        }
        
        stage('Python Microservice Check') {
            steps {
                 dir('PythonBackend') {
                     echo 'Checking Python service content...'
                     // Add steps to lint or test python code if needed
                     // sh 'pip install -r requirements.txt'
                     // sh 'python -m pytest'
                 }
            }
        }
    }

    post {
        always {
            echo 'Build completed.'
            // Archive artifacts if successful
            // archiveArtifacts artifacts: 'SpringBootBackend/SpringBootBackend/build/libs/*.jar', fingerprint: true
            // archiveArtifacts artifacts: 'angular-frontend/dist/**/*', fingerprint: true
        }
        success {
            echo 'Build succeeded!'
        }
        failure {
            echo 'Build failed.'
        }
    }
}
