# AccelerateAnalyticsAgent

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.0.5.

## Environment Setup

This project uses environment variables for configuration. These are not committed to the repository for security reasons.

1.  Copy the example environment file:
    ```bash
    cp src/environments/environment.example.ts src/environments/environment.ts
    ```

2.  Open `src/environments/environment.ts` and replace the placeholder values with your actual configuration:
    -   `projectId`: Your Google Cloud Project ID
    -   `googleClientId`: Your OAuth 2.0 Web Client ID
    -   `lookerClientId`: Your Looker Client ID
    -   `lookerClientSecret`: Your Looker Client Secret

## Google Cloud Setup

To deploy or interact with Google Cloud services, you need to be authenticated and have the correct project selected.

1.  Login to Google Cloud:
    ```bash
    gcloud auth login
    ```

2.  Set the active project:
    ```bash
    gcloud config set project YOUR_PROJECT_ID
    ```
    *(Replace `YOUR_PROJECT_ID` with your actual Google Cloud Project ID)*

3.  (Optional) If you need Application Default Credentials for local development:
    ```bash
    gcloud auth application-default login
    ```

## Development server

To start a local development server, run:

```bash
npm start
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
npm install
npm run ng -- generate --help
```

## Building

To build the project run:

```bash
npm run build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
npm test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
npm run ng -- e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Deployment to Cloud Run

`gcloud run deploy accelerate-analytics-agent --source .`
