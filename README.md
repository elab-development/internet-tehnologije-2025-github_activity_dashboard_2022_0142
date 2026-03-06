# GitHub Activity Dashboard

A dashboard application for tracking and analyzing GitHub repository activity I made for my Internet Tenchnologies university course. It allows users to search for repositories, view detailed commit history and contributor stats, and manage personal bookmarks.

## Features

-   **Repository Search:** Search for any public GitHub repository.
-   **Activity Dashboard:** View commit history, contributor statistics, and repository metrics.
-   **User Authentication:** Secure login and registration using NextAuth.js (Credentials provider).
-   **Bookmarks:** Save favorite repositories for quick access.
-   **Admin Panel:** Manage users and system settings (accessible to users with `ADMIN` role).
-   **API Documentation:** Interactive Swagger UI documentation for all API endpoints.
-   **Responsive Design:** Responsive UI built with Tailwind CSS.

## Tech

### Frontend
-   **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **Charts:** [Recharts](https://recharts.org/)

### Backend
-   **Database:** [MySQL](https://www.mysql.com/)
-   **ORM:** [Prisma](https://www.prisma.io/)
-   **Authentication:** [NextAuth.js v5 (Beta)](https://authjs.dev/)
-   **Caching:** [Redis (Upstash)](https://upstash.com/)
-   **External API:** GitHub REST API (via [Octokit](https://github.com/octokit/octokit.js))

### DevOps & Testing
-   **Unit Testing:** [Vitest](https://vitest.dev/)
-   **E2E Testing:** [Playwright](https://playwright.dev/)
-   **CI/CD:** GitHub Actions
-   **Deployment:** Docker, Azure Container Apps

## Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/milan/github-activity-dashboard.git
    cd github-activity-dashboard
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Configuration:**
    Create a `.env` file in the root directory and populate it with the following variables:

    ```env
    # Database
    DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"

    # Authentication
    AUTH_SECRET="your-super-secret-key" # Generate with `openssl rand -base64 32`
    AUTH_URL="http://localhost:3000"

    # GitHub API
    GH_TOKEN="your-github-personal-access-token"

    # Redis (Upstash or Local)
    UPSTASH_REDIS_REST_URL="http://localhost:6379"
    UPSTASH_REDIS_REST_TOKEN="your-redis-token"
    ```

4.  **Database Setup:**
    Initialize the database schema and seed it with initial data.

    ```bash
    # Generate Prisma Client
    npx prisma generate

    # Push schema to database
    npx prisma db push

    # Seed the database (creates initial user)
    npx prisma db seed
    ```
    *Note: The seed script creates a default user with email `test@example.com` and password `password123`.*

5.  **Run the Development Server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Documentation

The project includes an interactive Swagger UI for exploring the API endpoints.

After starting the server, navigate to while logged in to admin account:
[http://localhost:3000/admin/swagger](http://localhost:3000/admin/swagger)


## Testing

### Unit Tests
Unit tests are written using **Vitest** and are located in `__tests__` directories or alongside components.
```bash
npm run test
```

### End-to-End (E2E) Tests
E2E tests use **Playwright** and are located in the `e2e/` directory.
```bash
npm run test:e2e

npm run test:e2e:ui
```

## Deployment

The project is configured for deployment to **Azure Container Apps** via GitHub Actions.

The `.github/workflows/cicd.yaml` pipeline handles:
1.  **Build & Test:** Runs linting, unit tests, and E2E tests on every push.
2.  **Deploy:** Builds a Docker image and pushes it to Azure Container Registry (ACR), then deploys to Azure Container Apps (only on push to `main`).
