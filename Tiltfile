# version_settings() enforces a minimum Tilt version
# https://docs.tilt.dev/api.html#api.version_settings
version_settings(constraint='>=0.22.2')

# tilt-avatar-api is the backend (Python/Flask app)
# live_update syncs changed source code files to the correct place for the Flask dev server
# and runs pip (python package manager) to update dependencies when changed
# https://docs.tilt.dev/api.html#api.docker_build
# https://docs.tilt.dev/live_update_reference.html
# docker_build(
#     'tilt-avatar-api',
#     context='../../apps/service',
#     dockerfile='./service/Dockerfile
# )


docker_build(
    'go-service',
    context='.',
    dockerfile='apps/service/Dockerfile',
    # Include everything coppied into docker image
    only=['devbox.json','devbox.lock', 'package.json', 'nx.json', 'pnpm-lock.yaml','pnpm-workspace.yaml','go.work','go.work.sum','./libs/protos','./apps/service/'],
    ignore=['node_modules']
)


# k8s_yaml automatically creates resources in Tilt for the entities
# and will inject any images referenced in the Tiltfile when deploying
# https://docs.tilt.dev/api.html#api.k8s_yaml
# k8s_yaml('deploy/api.yaml')
k8s_yaml(local('envsubst < libs/k8s/config-map.yaml'))
k8s_yaml('libs/k8s/go-service.yaml')
# k8s_yaml('libs/k8s/ingress.yaml')


# k8s_resource allows customization where necessary such as adding port forwards and labels
# https://docs.tilt.dev/api.html#api.k8s_resource
k8s_resource(
    'api-service',
    port_forwards='5734:50051',
    labels=['backend']
)
