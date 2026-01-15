pipeline {
    agent any
    
    environment {
        CI = 'true'
        NODE_ENV = 'test'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'npm ci'
                        sh 'npx playwright install'
                    } else {
                        bat 'npm ci'
                        bat 'npx playwright install'
                    }
                }
            }
        }
        
        stage('Run Playwright Tests') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'npm run test'
                    } else {
                        bat 'npm run test'
                    }
                }
            }
        }
    }
    
    post {
        always {
            // Archive test results
            archiveArtifacts artifacts: 'reports/**/*', allowEmptyArchive: true
            
            // Publish HTML Report
            publishHTML([
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'reports/playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright HTML Report',
                reportTitles: 'Playwright Test Report'
            ])
            
            // Publish JUnit results if available
            script {
                if (fileExists('reports/junit-results.xml')) {
                    junit 'reports/junit-results.xml'
                }
            }
            
            // Publish Allure Report
            script {
                if (fileExists('reports/allure-results')) {
                    allure([
                        includeProperties: false,
                        jdk: '',
                        properties: [],
                        reportBuildPolicy: 'ALWAYS',
                        results: [[path: 'reports/allure-results']]
                    ])
                }
            }
        }
        
        failure {
            script {
                if (isUnix()) {
                    sh 'echo "Tests failed. Check the reports for details."'
                } else {
                    bat 'echo "Tests failed. Check the reports for details."'
                }
            }
        }
    }
}