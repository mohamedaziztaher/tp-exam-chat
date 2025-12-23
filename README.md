# Chat Application - DevOps Project

A modern chat application demonstrating comprehensive DevOps practices including containerization, CI/CD pipelines, and cloud deployment strategies.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [DevOps Technologies](#devops-technologies)
- [Deployment Platforms](#deployment-platforms)
- [CI/CD Pipeline](#cicd-pipeline)
- [Local Development](#local-development)
- [Configuration](#configuration)

## 🎯 Project Overview

This is a full-stack chat application with:
- **Backend**: Node.js/Express REST API for message handling
- **Frontend**: Static HTML/CSS/JavaScript client
- **Storage**: In-memory message storage (stateless backend)

## 🏗️ Architecture

```
┌─────────────┐         ┌─────────────┐
│   Vercel    │────────▶│    Render   │
│  (Frontend) │  HTTP   │  (Backend)  │
└─────────────┘         └─────────────┘
     │                        │
     └────────────────────────┘
              │
         GitHub Actions
         (CI/CD Pipeline)
```

- **Frontend**: Deployed on Vercel (static hosting)
- **Backend**: Deployed on Render (Node.js service)
- **CI/CD**: Automated via GitHub Actions

## 🛠️ DevOps Technologies

### 1. **Docker & Docker Compose**

#### Backend Dockerfile
- **Base Image**: `node:18-alpine` (lightweight Node.js runtime)
- **Build Process**:
  1. Sets working directory to `/app`
  2. Copies `package.json` and installs dependencies
  3. Copies application code
  4. Exposes port 3000
  5. Runs `npm start` on container startup

#### Frontend Dockerfile
- **Base Image**: `nginx:alpine` (lightweight web server)
- **Build Process**:
  1. Copies `index.html` to nginx HTML directory
  2. Exposes port 80
  3. Runs nginx in foreground mode

#### Docker Compose Configuration
- **Version**: 3.8
- **Services**:
  - `backend`: Node.js API service on port 3000
  - `frontend`: Nginx static file server on port 80
- **Features**:
  - Volume mounting for hot-reload development
  - Service dependencies (frontend depends on backend)
  - Environment variable configuration

### 2. **Containerization Benefits**
- **Consistency**: Same environment across development, testing, and production
- **Isolation**: Services run independently without conflicts
- **Portability**: Easy deployment to any Docker-compatible platform
- **Scalability**: Can easily scale services horizontally

## 🚀 Deployment Platforms

### **Render (Backend Deployment)**

Render is used to host the Node.js backend API.

#### Why Render?
- **Free Tier**: Suitable for development and small projects
- **Auto-deploy**: Automatic deployments from Git
- **Health Checks**: Built-in health monitoring
- **Environment Variables**: Easy configuration management
- **HTTPS**: Automatic SSL/TLS certificates

#### Configuration
- **Service Type**: Web Service
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment**: Node.js 18
- **Port**: 3000 (automatically detected)

#### Render Deployment Process
1. Connect GitHub repository to Render
2. Configure service settings (build/start commands)
3. Set environment variables (if needed)
4. Render automatically builds and deploys on push to main branch
5. Service is accessible via `https://your-service.onrender.com`

#### Backend URL Configuration
The frontend is configured to connect to the Render backend URL:
```javascript
const renderBackendUrl = 'https://tp-exam-chat-77z1.onrender.com';
```

### **Vercel (Frontend Deployment)**

Vercel is used to host the static frontend application.

#### Why Vercel?
- **Optimized CDN**: Global content delivery network
- **Automatic HTTPS**: SSL certificates included
- **Preview Deployments**: Automatic preview URLs for PRs
- **Zero Configuration**: Works out of the box for static sites
- **Fast Deployments**: Sub-second deployment times

#### Configuration
- **Project Type**: Static Site
- **Build Command**: None (static HTML)
- **Output Directory**: `frontend/`
- **Framework Preset**: Other

#### Vercel Deployment Process
1. Connect GitHub repository to Vercel
2. Configure project settings (root directory: `frontend`)
3. Vercel automatically detects and deploys static files
4. Each push creates a new deployment
5. Production deployments on main branch

#### Vercel Features Used
- **Automatic Deployments**: On every push to main/master
- **Preview Deployments**: For pull requests
- **Custom Domains**: Support for custom domain configuration
- **Environment Variables**: Can be configured in Vercel dashboard

## 🔄 CI/CD Pipeline

The project uses **GitHub Actions** for continuous integration and continuous deployment.

### Pipeline Location
`.github/workflows/ci.yml`

### Pipeline Triggers
- **Push** to `main` or `master` branch
- **Pull Requests** to `main` or `master` branch

### Pipeline Jobs

#### 1. **test-backend** Job
- **Purpose**: Test the backend API
- **Steps**:
  1. Checkout code
  2. Setup Node.js 18
  3. Install backend dependencies
  4. Start backend server in background
  5. Wait for server to be ready (health check)
  6. Test `/health` endpoint
  7. Test `GET /api/messages` endpoint
  8. Test `POST /api/messages` endpoint
- **Validation**: Ensures API endpoints work correctly before deployment

#### 2. **test-frontend** Job
- **Purpose**: Validate frontend code
- **Steps**:
  1. Checkout code
  2. Validate HTML syntax (if HTML Tidy is available)
- **Validation**: Ensures frontend code quality

#### 3. **build-backend** Job
- **Purpose**: Build Docker image for backend
- **Dependencies**: Runs after `test-backend` succeeds
- **Steps**:
  1. Checkout code
  2. Setup Docker Buildx (for multi-platform builds)
  3. Build backend Docker image
  4. Use Docker layer caching for faster builds
- **Output**: Docker image ready for deployment

#### 4. **build-frontend** Job
- **Purpose**: Build Docker image for frontend
- **Dependencies**: Runs after `test-frontend` succeeds
- **Steps**:
  1. Checkout code
  2. Setup Docker Buildx
  3. Build frontend Docker image
  4. Use Docker layer caching
- **Output**: Docker image ready for deployment

#### 5. **deploy-backend** Job
- **Purpose**: Deploy backend to Render
- **Dependencies**: Requires `test-backend` and `build-backend` to succeed
- **Condition**: Only runs on `main` or `master` branch (not on PRs)
- **Steps**:
  1. Checkout code
  2. Deploy to Render using `johnbeynon/render-deploy-action@v0.0.8`
  3. Uses GitHub secrets for authentication:
     - `RENDER_SERVICE_ID`: Render service identifier
     - `RENDER_API_KEY`: Render API key
- **Note**: Uses `continue-on-error: true` to prevent pipeline failure if Render is not configured

#### 6. **deploy-frontend** Job
- **Purpose**: Deploy frontend to Vercel
- **Dependencies**: Requires `test-frontend` and `build-frontend` to succeed
- **Condition**: Only runs on `main` or `master` branch (not on PRs)
- **Steps**:
  1. Checkout code
  2. Deploy to Vercel using `amondnet/vercel-action@v25`
  3. Uses GitHub secrets for authentication:
     - `VERCEL_TOKEN`: Vercel authentication token
     - `VERCEL_ORG_ID`: Vercel organization ID
     - `VERCEL_PROJECT_ID`: Vercel project ID
  4. Deploys to production (`--prod` flag)
  5. Working directory set to `./frontend`
- **Note**: Uses `continue-on-error: true` to prevent pipeline failure if Vercel is not configured

### Pipeline Flow Diagram

```
Push/PR to main/master
        │
        ├─▶ test-backend ──┐
        │                   │
        └─▶ test-frontend ──┤
                            │
        ┌───────────────────┘
        │
        ├─▶ build-backend ────┐
        │                     │
        └─▶ build-frontend ───┤
                              │
        ┌─────────────────────┘
        │
        ├─▶ deploy-backend (only on main/master)
        │
        └─▶ deploy-frontend (only on main/master)
```

### GitHub Secrets Required

To enable automated deployments, configure these secrets in GitHub repository settings:

#### For Render (Backend)
- `RENDER_SERVICE_ID`: Your Render service ID
- `RENDER_API_KEY`: Your Render API key

#### For Vercel (Frontend)
- `VERCEL_TOKEN`: Your Vercel authentication token
- `VERCEL_ORG_ID`: Your Vercel organization ID
- `VERCEL_PROJECT_ID`: Your Vercel project ID

### CI/CD Benefits
- **Automated Testing**: Every change is tested before deployment
- **Quality Assurance**: Prevents broken code from reaching production
- **Fast Feedback**: Developers get immediate feedback on their changes
- **Consistent Deployments**: Standardized deployment process
- **Rollback Capability**: Easy to revert to previous working versions

## 💻 Local Development

### Prerequisites
- Docker and Docker Compose installed
- Node.js 18+ (for local backend development)
- Git

### Running with Docker Compose

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tp-exam-chat
   ```

2. **Start services**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:80
   - Backend API: http://localhost:3000
   - Health Check: http://localhost:3000/health

4. **Stop services**
   ```bash
   docker-compose down
   ```

### Running Backend Locally (without Docker)

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start server**
   ```bash
   npm start
   ```

4. **Server runs on** http://localhost:3000

### Running Frontend Locally

Simply open `frontend/index.html` in a web browser, or use a local server:

```bash
cd frontend
python -m http.server 8000
# or
npx serve .
```

## ⚙️ Configuration

### Backend Configuration

- **Port**: Configurable via `PORT` environment variable (default: 3000)
- **CORS**: Configured to allow requests from:
  - Localhost (development)
  - Vercel deployments (`.vercel.app`, `vercel.sh`, `vercel.com`)
  - File protocol (local file access)

### Frontend Configuration

- **API URL**: Automatically detected based on environment
  - Development: `http://localhost:3000`
  - Production: Render backend URL (configured in `index.html`)

### Environment Variables

#### Backend (Render)
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment mode (production/development)

#### Frontend (Vercel)
- Can be configured in Vercel dashboard if needed

## 📝 API Endpoints

### `GET /api/messages`
- **Description**: Retrieve all messages
- **Response**: Array of message objects
- **Example**:
  ```json
  [
    {
      "id": "1234567890",
      "author": "John Doe",
      "content": "Hello, world!",
      "timestamp": "2024-01-01T12:00:00.000Z"
    }
  ]
  ```

### `POST /api/messages`
- **Description**: Create a new message
- **Request Body**:
  ```json
  {
    "author": "John Doe",
    "content": "Hello, world!"
  }
  ```
- **Response**: Created message object
- **Status Code**: 201 (Created)

### `GET /health`
- **Description**: Health check endpoint
- **Response**:
  ```json
  {
    "status": "ok"
  }
  ```

## 🔒 Security Considerations

- **CORS**: Configured to allow specific origins only
- **Input Validation**: Backend validates required fields
- **XSS Protection**: Frontend escapes HTML in user input
- **HTTPS**: Enforced on production (Render & Vercel)

## 📚 Technologies Used

### Backend
- **Node.js**: Runtime environment
- **Express**: Web framework
- **CORS**: Cross-origin resource sharing middleware

### Frontend
- **HTML5**: Markup
- **CSS3**: Styling with modern features (flexbox, gradients)
- **Vanilla JavaScript**: No frameworks, pure JS

### DevOps
- **Docker**: Containerization
- **Docker Compose**: Multi-container orchestration
- **GitHub Actions**: CI/CD automation
- **Render**: Backend hosting
- **Vercel**: Frontend hosting

## 🚦 Project Status

- ✅ Backend API implemented
- ✅ Frontend client implemented
- ✅ Docker containerization
- ✅ Docker Compose configuration
- ✅ CI/CD pipeline configured
- ✅ Render deployment setup
- ✅ Vercel deployment setup


**Note**: This project demonstrates modern DevOps practices including containerization, automated testing, CI/CD pipelines, and cloud deployment strategies.

