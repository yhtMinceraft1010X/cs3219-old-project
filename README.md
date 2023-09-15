[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/6BOvYMwN)

## PeerPrep Monorepo User Guide

Prerequisites for PeerPrep Monorepo:

1.  **Yarn:** Ensure you have the latest version of Yarn installed. Yarn
    Workspaces is available in Yarn v1.0 and later.
2.  Installation (if not already installed):

    ```bash
    npm install -g yarn
    ```

3.  **Node.js:** Check each application's documentation for the recommended
    Node.js version.
4.  **Git (Optional but Recommended):**
5.  **Docker (If deploying with Docker):**
6.  **Kubernetes Tools (If deploying with Kubernetes):**

---

Make sure to adjust these prerequisites based on the specific requirements of
your services and applications, as well as any additional tools or systems you
may use.

### Structure:

```
/peerprep
├── /services
│   ├── /user-service (express application)
│   ├── /matching-service (express application)
│   ├── /question-service (express application)
│   └── /collaboration-service (express application)
├── /frontend
│   └── /pages for peerprep (NextJs application)
├── /deployment
│   ├── /docker
│   └── /kubernetes
└── README.md (and other root-level files & docs)
```

### Getting Started - Local Development:

1. **Installing Dependencies:** From the root directory (`/peerprep`), run:

   ```bash
   yarn install
   ```

   This command will install dependencies for all services and the frontend in a
   centralized `node_modules` directory at the root.

2. **Adding Dependencies:** To add a dependency to a specific workspace (e.g.,
   `user-service`), use:

   ```bash
   yarn workspace user-service add [dependency-name]
   ```

3. **Initializing Prisma:** In the root file, run the following:

   ```bash
   yarn prisma generate ## Do this whenever we change the models in schema.prisma
   ```

4. **Running Backend Scripts:** To run a script specific to a workspace (e.g.,
   the `start` script for `user-service`), use:

   ```bash
   yarn workspace user-service start
   ```

5. **Running Frontend Scripts:** To run the frontend cod, use:
   ```bash
   yarn workspace frontend build ## For first time setup run the build command
   yarn workspace frontend start ## For subsequent runs
   ```

### Getting Started - Docker:

1. **Run the start-app.sh script:** From the root repo, run

```bash
./start-app.sh # on mac / linus

start-app.sh # on windows
```

# now that your

```

### Notes:

- After setting up Yarn Workspaces, any `node_modules` directories in individual
services or applications can be safely removed.
- Always ensure thorough testing after adding or updating dependencies to ensure
all parts of the system function as expected.

### Prisma Notes

Next steps:

1. Set the DATABASE_URL in the .env file to point to your existing database. If
your database has no tables yet, read https://pris.ly/d/getting-started
2. Set the provider of the datasource block in schema.prisma to match your
database: postgresql, mysql, sqlite, sqlserver, mongodb or cockroachdb.
3. Run prisma db pull to turn your database schema into a Prisma schema.
4. Run prisma generate to generate the Prisma Client. You can then start
querying your database.
```
