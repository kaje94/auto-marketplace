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
    'NEXT_PUBLIC_SUPPORT_EMAIL': os.getenv('NEXT_PUBLIC_SUPPORT_EMAIL', 'support@taragabay.com'),
}
api_resource_name = 'api-service'
api_resource_image_name = 'kajendranalagaratnam/targabay-api-service'
webapp_resource_name = 'webapp'
webapp_resource_image_name = 'kajendranalagaratnam/targabay-webapp'
webapp_resource_port = '3000'

# Define docker builds
docker_build(
    api_resource_image_name,
    context='.',
    dockerfile='apps/service/Dockerfile.dev' if dev_mode else 'apps/service/Dockerfile',
    only=common_only + ['go.work','go.work.sum'],
    ignore=common_ignore,
)
docker_build(
    webapp_resource_image_name,
    context='.',
    dockerfile='apps/webapp/Dockerfile.dev' if dev_mode else 'apps/webapp/Dockerfile',
    only=common_only + ['./apps/webapp/'],
    ignore=common_ignore + ['.next'],
    build_args=webapp_build_args,
)

env_keys = [
    'AUTH0_ISSUER_BASE_URL',
    'AUTH0_AUDIENCE',
    'AUTH0_DOMAIN',
    'AUTH0_API_CLIENT_ID',
    'AUTH0_API_CLIENT_SECRET',
    'AUTH0_SECRET',
    'AUTH0_BASE_URL',
    'AUTH0_CLIENT_ID',
    'AUTH0_CLIENT_SECRET',
    'AUTH0_SCOPE',
    'XATA_DATABASE_URL',
    'XATA_API_KEY',
    'XATA_BRANCH',
    'S3_KEY',
    'S3_SECRET',
    'S3_BUCKET',
    'S3_REGION',
    # Optional configs
    'IMAGE_CDN_BASE',
    'RECAPTCHA_SITE_SECRET',
    'NEXT_CONTACT_US_FORM_KEY'
]

# Initialize an empty list to hold the --set arguments as key, value turple
arg_keys_values = []
arg_keys_values.append(["apiService.appName", api_resource_name])
arg_keys_values.append(["apiService.image.name", api_resource_image_name])
arg_keys_values.append(["webApp.appName", webapp_resource_name])
arg_keys_values.append(["webApp.image.name", webapp_resource_image_name])
arg_keys_values.append(["webApp.port", webapp_resource_port])

# Loop through the environment keys and get env values
for key in env_keys:
    value = os.getenv(key, '')
    if value:
        arg_keys_values.append(["configMap.values." + key, value])

helm_args = []
for arg in arg_keys_values:
    helm_args.append(arg[0] + "='" + arg[1] + "'")

helm_command = "helm template --set " + ",".join(helm_args) + " libs/helm"

k8s_yaml(local(helm_command))
watch_file('libs/helm')

# k8s_resource allows customization where necessary such as adding port forwards and labels
k8s_resource(webapp_resource_name, port_forwards=webapp_resource_port, labels=[webapp_resource_name])
k8s_resource(api_resource_name, labels=['go-api'])