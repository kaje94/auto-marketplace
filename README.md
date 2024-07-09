# Auto Marketplace

Welcome to the Auto Marketplace project! This platform offers a seamless and intuitive experience for buying and selling vehicles online.

<a href="https://targabay.com/lk">
    <img alt="preview-image" src="apps/webapp/public/images/banner.jpg" width="1024">
</a>

<br>

![](https://api.checklyhq.com/v1/badges/checks/d8ee5b92-7ff0-4809-9cc4-405274b5411b?style=flat&theme=default)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=kaje94_auto-marketplace-client&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=kaje94_auto-marketplace-client)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=kaje94_auto-marketplace-client&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=kaje94_auto-marketplace-client)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=kaje94_auto-marketplace-client&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=kaje94_auto-marketplace-client)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=kaje94_auto-marketplace-client&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=kaje94_auto-marketplace-client)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=kaje94_auto-marketplace-client&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=kaje94_auto-marketplace-client)

## Features

1. **Free Vehicle Listings**: List your vehicle for free on our platform. Reach a wide audience of potential buyers without any cost.

2. **Advanced Search Filters**: Easily find the vehicle that suits your needs with advanced search filters. Filter by make, model, year, price range, and more.

3. **Subscription and Notifications**: Subscribe to specific criteria and receive notifications whenever new listings matching your interests are added. Stay informed without constantly checking the platform.

4. **Simple and Intuitive User Experience**: We prioritize a clean and user-friendly design to ensure a straightforward experience for both buyers and sellers. Navigate through the platform with ease.

## Tools and Technologies

- **Web Application**: [Next.js (App Router)](https://nextjs.org/docs/app/building-your-application/routing), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/) & [DaisyUI](https://daisyui.com/), [Storybook](https://storybook.js.org/)
- **Backend (API service & cron jobs)**: [Go](https://golang.org/)
- **API**: [gRPC](https://grpc.io/)
- **Data Store**: [Xata](https://xata.io/)
- **Authentication**: [Auth0](https://auth0.com/)
- **Deployment**: [Kubernetes](https://kubernetes.io/), [Helm](https://helm.sh/), [ArgoCD](https://argoproj.github.io/argo-cd/), [Dockerhub](https://hub.docker.com/)
- **E2E Testing**: [Playwright](https://playwright.dev/)
- **Infrastructure**: [AWS SES](https://aws.amazon.com/ses/), [AWS S3](https://aws.amazon.com/s3/)
- **Other Tools**: [Pulumi](https://www.pulumi.com/), [React-email](https://www.npmjs.com/package/react-email), [ImageKit](https://imagekit.io/), [NX](https://nx.dev/), [Tilt](https://tilt.dev/), [Devbox](https://www.jetify.com/devbox), [Thumbhash](https://github.com/evanw/thumbhash)

## Running Locally

You can run the application locally either using Kubernetes or by running commands directly. Follow these steps:

### Prerequisites

1. **Set Up Infrastructure**: Follow the [Pulumi guide](/libs/pulumi/README.md) to create the necessary infrastructure.
2. **Initialize Xata**: Follow the [Xata guide](/libs/xata/README.md) to set up Xata.
3. **Create .env File**: Use the values from the previous steps to create a `.env` file based on the [.env.example](.env.example) file in the root of the repository.
4. **Load Environment Variables**: Install [direnv](https://direnv.net/) and run `direnv allow` to load the `.envrc` or `.env` file.
5. **Install Devbox**: Install [Devbox](https://www.jetpack.io/devbox/) and run `devbox shell` to install the required packages and tools. (Optionally, install the [Devbox VSCode extension](https://marketplace.visualstudio.com/items?itemName=jetpack-io.devbox) if you use VSCode).

#### Running with Kubernetes

1. **Set Up Docker and Kubernetes**: Make sure your Docker daemon and a local Kubernetes node (e.g., [Minikube](https://minikube.sigs.k8s.io/docs/), [Rancher](https://rancher.com/)) are running.
2. **Install Tilt**: Install [Tilt](https://tilt.dev/).
3. **Start Application**: Run `tilt up` to deploy Targabay within local Kubernetes.

#### Running with Commands

1. **Install Dependencies**: Run `pnpm i` to install the dependencies.
2. **Start Application**: Run `pnpm dev` to start the API server and web app in development mode.
3. **More Scripts**: Check the [package.json](package.json) for other available scripts.

## Contributing

We welcome contributions! If you'd like to contribute to the code or have questions about the project, please follow our [contribution guidelines](.github/CONTRIBUTING.md).

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

If you have any questions or feedback, feel free to reach out to us at [a.kajendran@gmail.com](mailto:a.kajendran@gmail.com).
