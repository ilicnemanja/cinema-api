pipeline {
    agent any

    environment {
        NODE_VERSION = '22.14.0'
        DEPLOY_PATH = '/home/ubuntu/cinema-api'
        REPO_URL = 'https://github.com/ilicnemanja/cinema-api.git'
    }

    stages {
        stage('Checkout Code') {
            steps {
                script {
                    if (fileExists('package.json')) {
                        sh 'git reset --hard'
                        sh 'git pull origin main'
                    } else {
                        sh "git clone $REPO_URL ."
                    }
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'NODE_OPTIONS="--max-old-space-size=512" npm install --legacy-peer-deps --prefer-offline --no-audit --no-fund'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Deploy Locally on EC2') {
            steps {
                sh """
                mkdir -p $DEPLOY_PATH
                rsync -av --delete dist $DEPLOY_PATH
                cp package.json package-lock.json $DEPLOY_PATH
                cd $DEPLOY_PATH
                npm install --only=prod
                pm2 restart cinema-api || pm2 start dist/main.js --name cinema-api
                """
            }
        }
    }
}
