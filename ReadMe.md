# Tax Calculator Project
**Written by Brian McCarthy**

## Programming Languages
- **JavaScript / TypeScript**: Core application logic and React components.
- **HTML/CSS**: Structure and styling via Tailwind CSS.
- **YAML**: Configuration for Tekton CI/CD pipelines.

## Technologies Used
- **Frontend**: React 19, Vite, Tailwind CSS 4, Motion.
- **Backend**: Node.js, Express.
- **Database**: Firebase Firestore (NoSQL).
- **Testing**: Jasmine.
- **DevOps**: Docker, Tekton CI/CD.
- **Cloud**: IBM Cloud.

## How to Use
1. **Income Entry**: Enter your total gross income in the "Your Total Income" field.
2. **Details**: Optionally enter City, State, Zip Code, and Allowances.
3. **Calculate**: Click the "Calculate" button to see your tax breakdown.
4. **Save/Clear**: Use the header buttons to persist your progress in local storage or reset the form.
5. **Assessment**: Review the "Deployment Log" for taxable income and tax due.

## Tasks
- [x] Create React-based frontend for tax input.
- [x] Implement tax calculation algorithm in `taxCalculator.js`.
- [x] Configure Firebase Firestore to store and fetch tax brackets.
- [x] Add Express backend with health check endpoint.
- [x] Dockerize the application for containerized deployment.
- [x] Define Tekton pipelines for automated testing and building.
- [x] Implement unit tests using Jasmine.

## Requirements
- Progressive tax calculation logic.
- Dynamic data fetching from a NoSQL database.
- Health monitoring endpoint (`/health`).
- Containerized runtime (Dockerfile).
- CI/CD pipeline definitions (`tasks.yaml`, `pipeline.yaml`).

## Prerequisites
- Node.js installed on your machine.
- A Firebase project for the NoSQL backend.
- Docker for building the container image.
- access to a Tekton-enabled environment for pipelines.
