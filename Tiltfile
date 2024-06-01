# version_settings() enforces a minimum Tilt version
# https://docs.tilt.dev/api.html#api.version_settings
version_settings(constraint='>=0.22.2')

# additional argument to run in dev mode
# `tilt up -- --dev` will run in dev mode, else prod mode
config.define_bool("dev")
dev_mode = 'dev' in config.parse()

# Common properties for docker_build
common_only = ['devbox.json','devbox.lock','package.json','nx.json','pnpm-lock.yaml','pnpm-workspace.yaml','./libs/protos','./apps/service/']
common_ignore = ['node_modules']
webapp_build_args = {
    # Public env variables
    'NEXT_PUBLIC_RECAPTCHA_SITE_KEY': os.getenv('NEXT_PUBLIC_RECAPTCHA_SITE_KEY', ''),
    'NEXT_PUBLIC_SUPPORT_EMAIL': os.getenv('NEXT_PUBLIC_SUPPORT_EMAIL', 'support@taragabay.com'),
    'NEXT_PUBLIC_IMAGE_CDN_BASE': os.getenv('NEXT_PUBLIC_IMAGE_CDN_BASE', ''),
    'NEXT_PUBLIC_SENTRY_KEY': os.getenv('NEXT_PUBLIC_SENTRY_KEY', ''),
    # Private env variables
    'GRPC_API_BASE_URL': os.getenv('GRPC_API_BASE_URL', ''),
    'AUTH0_SECRET': os.getenv('AUTH0_SECRET', ''),
    'AUTH0_BASE_URL': os.getenv('AUTH0_BASE_URL', ''),
    'AUTH0_ISSUER_BASE_URL': os.getenv('AUTH0_ISSUER_BASE_URL', ''),
    'AUTH0_CLIENT_ID': os.getenv('AUTH0_CLIENT_ID', ''),
    'AUTH0_CLIENT_SECRET': os.getenv('AUTH0_CLIENT_SECRET', ''),
    'AUTH0_AUDIENCE': os.getenv('AUTH0_AUDIENCE', ''),
    'AUTH0_SCOPE': os.getenv('AUTH0_SCOPE', ''),
    'NEXT_CONTACT_US_FORM_KEY': os.getenv('NEXT_CONTACT_US_FORM_KEY', ''),
    'RECAPTCHA_SITE_SECRET': os.getenv('RECAPTCHA_SITE_SECRET', ''),
}

# Define docker builds
docker_build(
    'go-service-image',
    context='.',
    dockerfile='apps/service/Dockerfile.dev' if dev_mode else 'apps/service/Dockerfile',
    only=common_only + ['go.work','go.work.sum'],
    ignore=common_ignore,
)
docker_build(
    'webapp-image',
    context='.',
    dockerfile='apps/webapp/Dockerfile.dev' if dev_mode else 'apps/webapp/Dockerfile',
    only=common_only + ['./apps/webapp/'],
    ignore=common_ignore + ['.next'],
    build_args=webapp_build_args,
)

# k8s_yaml automatically creates resources in Tilt for the entities
# and will inject any images referenced in the Tiltfile when deploying
k8s_yaml('libs/k8s/namespace.yaml')
k8s_yaml(local('envsubst < libs/k8s/config-map.yaml'))
k8s_yaml('libs/k8s/go-api.yaml')
k8s_yaml('libs/k8s/web-app.yaml')

# k8s_resource allows customization where necessary such as adding port forwards and labels
k8s_resource('webapp-deployment', port_forwards='3000:3000', labels=['webapp'])
k8s_resource('go-deployment', labels=['go-api'])