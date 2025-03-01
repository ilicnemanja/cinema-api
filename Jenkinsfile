pipeline {
    agent any

    environment {
        NODE_VERSION = '22.14.0'
        DEPLOY_PATH = '/home/ubuntu/cinema-api'
    }

    stages {
        stage('Checkout Code') {
            steps {
                script {
                    sh 'git clone https://github.com/ilicnemanja/cinema-api.git repo'
                    sh 'cd repo && git checkout main'
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    sh 'cd repo && npm install'
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    sh 'cd repo && npm run build'
                }
            }
        }

        stage('Deploy Locally on EC2') {
            steps {
                script {
                    sh """
                    cp -r repo/dist repo/package.json repo/package-lock.json $DEPLOY_PATH
                    cd $DEPLOY_PATH
                    npm install --only=prod
                    pm2 restart all || pm2 start dist/main.js --name cinema-api
                    """
                }
            }
        }
    }
}
