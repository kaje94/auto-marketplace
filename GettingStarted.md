install dirEnv

`direnv allow` to approve the contents of .envrc

install devbox
curl -fsSL https://get.jetify.com/devbox | bash

start devbox shell (not needed if you have installed the recommended vscode extensions)
`devbox shell`


// TO run in local kubernates cluester
prerequisutes
docker
minikube@1.32.0,
tilt@latest

start your minikube server

To enable the NGINX Ingress controller, run the following command:
minikube addons enable ingress

To deploy Targabay in your local kubernates cluster (in prod mode)
`tilt up`

To deploy Targabay in your local kubernates cluster (in dev mode)
`tilt up -- --dev`


///
/// Using NX
//
install packages `pnpm i`
help 
/// docker push steps
docker login 

// service
docker build -f apps/service/Dockerfile -t kajendranalagaratnam/targabay-api-service .
docker push kajendranalagaratnam/targabay-api-service:latest

// webapp
docker build -f apps/webapp/Dockerfile -t kajendranalagaratnam/targabay-webapp .
docker push kajendranalagaratnam/webapp:latest

////


// HELM

