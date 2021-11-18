node {

    agent none

    checkout scm

    stages {
        stage('Node.js Build') {
            
            steps {
                docker.withRegistry('https://artifactory.a4apple.cn/', 'e6b12a98-49f1-4477-ab5c-c1286a94ac01') {

                 def customImage = docker.build("docker_test/ddep:${env.BUILD_ID}")
                }
            }

        stage('Push Img to Artifactory') {
            
            steps {
                /* Push the container to the custom Registry */
                customImage.push()

                customImage.push('latest')
                }
            }
        
    }
}
