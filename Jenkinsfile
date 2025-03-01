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

        stage('Build') {
            steps {
                sh """
                echo "Installing NestJS CLI..."
                npm install -g @nestjs/cli

                echo "Checking if NestJS CLI is available..."
                export PATH=\$PATH:\$(npm root -g)/@nestjs/cli
                nest --version || echo "NestJS CLI not found!"

                echo "Running the build..."
                npm run build
                """
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
