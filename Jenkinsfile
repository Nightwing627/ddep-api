node {
    checkout scm

    docker.withRegistry('https://artifactory.a4apple.cn/', 'e6b12a98-49f1-4477-ab5c-c1286a94ac01') {

        def customImage = docker.build("docker_test/ddep_p2:${env.BUILD_ID}")

        /* Push the container to the custom Registry */
        customImage.push()

        customImage.push('latest')
    }
}



