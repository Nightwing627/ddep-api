node {
    checkout scm

    docker.withRegistry('https://artifactory.a4apple.cn/', 'e6b12a98-49f1-4477-ab5c-c1286a94ac01') {

        def customImage = docker.build("docker_test/ddep:v1")

        /* Push the container to the custom Registry */
        customImage.push()
    }
}