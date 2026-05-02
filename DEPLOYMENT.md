# Deployment Documentation - DAVTrading

This document describes the deployment process and production environment configuration for the DAVTrading application.

## Production Environment

The application is built using **Next.js** and is optimized for deployment on platforms like **Vercel** or **Netlify**.

### Environment Variables

Ensure the following environment variables are configured in your production environment:

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | Base URL for the API (if applicable) | No |
| `COINGECKO_API_KEY` | Optional API key for higher rate limits | No |

## Deployment Steps

### 1. Automated Deployment (Recommended)

The project is configured with **GitHub Actions**. Every push to the `main` branch will automatically:
1. Install dependencies
2. Run linting and tests
3. Build the application
4. (Optional) Deploy to the hosting provider

### 2. Manual Deployment

To deploy manually, run the following commands:

```bash
# Install dependencies
pnpm install

# Build the application
pnpm build

# Start the production server
pnpm start
```

## Monitoring and Alerting

We use the following tools for monitoring:
- **Vercel Analytics / Speed Insights**: For performance monitoring.
- **Sentry**: For error tracking and alerting.
- **GitHub Actions**: For monitoring build and deployment health.

### Alerting Rules
- Build failures trigger notifications to the repository owners.
- Production errors (via Sentry) trigger immediate alerts for critical issues.
