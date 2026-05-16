# Cloud Native Tax Calculator - Final Project
**Written by: Brian McCarthy**

## Overview
This project is a modernized "Tax Calculator" application designed with Cloud-Native, DevOps, and Agile principles. It features a React-based frontend, an Express-based backend with a health check endpoint, and is fully containerized for deployment on IBM Cloud.

## Technologies Used
- **Frontend**: React 19, Tailwind CSS 4, Motion (Animations)
- **Backend & NoSQL**: Node.js, Express, **Firebase Firestore**
- **Testing**: Jasmine (Unit Testing)
- **DevOps**: Docker (Containerization), Tekton (CI/CD Pipelines)
- **Style**: Elegant Dark (Modern Design)

## Key Functions
- **Tax Calculation**: Calculates progressive income tax based on configurable brackets.
- **True NoSQL Backend**: Tax brackets are now dynamically fetched from **Firebase Firestore** at runtime. This removes the dependency on static JSON files and allows real-time configuration updates without redeploying.
- **Automatic Seeding**: The application automatically seeds the Firestore collection (`taxBrackets`) on first run if no data is found, ensuring a smooth transition to NoSQL.
- **Health Monitoring**: Provides a `/health` endpoint for infrastructure monitoring (Liveness/Readiness).
- **Responsive UI**: Polished interface with dark mode aesthetics, loading states for backend fetching, and real-time calculation previews.

## NoSQL Implementation Details
- **Collection**: `taxBrackets`
- **Data Shape**: Each document represents a tier with `limit` (bound), `rate` (multiplier), `order` (for sorting), and `label`.
- **Security**: Hardened Firestore rules ensure that while brackets are publicly readable for client-side calculations, unauthorized writes are blocked at the database level.

## Requirements
- Node.js 20+
- Docker (for containerization)
- npm (for dependency management)

## Deliverables
- **Codebase**: Fully functional JavaScript application.
- **Tests**: Suite of 7 Jasmine specs verifying calculation logic.
- **Dockerfile**: Production-ready container definition.
- **Tekton Pipeline**: YAML definitions for automated Build-Test-Deploy flows.

## How to Use

### Local Development
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Run unit tests locally:
   ```bash
   npm test
   ```

### Building & Running with Docker
1. Build the image:
   ```bash
   docker build -t tax-calculator .
   ```
2. Run the container:
   ```bash
   docker run -p 3000:3000 tax-calculator
   ```
3. Access the app at `http://localhost:3000` and health check at `http://localhost:3000/health`.

## Updating Tax Brackets
To update the tax rules, modify the `src/config/taxBrackets.json` file. Each bracket requires:
- `limit`: The upper bound of the bracket (use `null` for the top bracket).
- `rate`: The tax rate as a decimal (e.g., 0.15 for 15%).
- `label`: A descriptive name for the tier.

Once updated, rebuild the application or restart the dev server to apply changes.
