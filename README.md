# Chat Application

Application de chat en temps réel avec frontend et backend séparés.

## 🚀 Fonctionnalités

### Frontend
- Interface utilisateur moderne et responsive
- Saisie de pseudo
- Affichage des messages avec auteur et heure
- Envoi de messages
- Actualisation automatique toutes les 4 secondes
- Actualisation manuelle au clic

### Backend
- API REST avec Express
- GET `/api/messages` - Récupère tous les messages
- POST `/api/messages` - Ajoute un message
- Stockage en mémoire
- CORS activé

## 📦 Installation

### Prérequis
- Node.js 18+
- Docker et Docker Compose (optionnel)

### Développement local

1. **Backend**
```bash
cd backend
npm install
npm start
```

Le serveur démarre sur `http://localhost:3000`

2. **Frontend**
Ouvrez `frontend/index.html` dans un navigateur ou servez-le avec un serveur HTTP.

**Note:** Modifiez la variable `API_URL` dans `frontend/index.html` pour pointer vers votre backend.

### Avec Docker

```bash
docker-compose up --build
```

- Backend: `http://localhost:3000`
- Frontend: `http://localhost:80`

## 🧪 Tests

```bash
cd backend
npm test
```

## 🚢 Déploiement

### Backend (Render)

1. Créez un compte sur [Render](https://render.com)
2. Créez un nouveau service Web
3. Connectez votre repository GitHub
4. Configurez:
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
   - Environment: `NODE_ENV=production`

### Frontend (Vercel)

1. Créez un compte sur [Vercel](https://vercel.com)
2. Importez votre repository GitHub
3. Configurez:
   - Root Directory: `frontend`
   - Build Command: (laisser vide)
   - Output Directory: `.`

**Important:** Après le déploiement du backend, mettez à jour `API_URL` dans `frontend/index.html` avec l'URL Render de votre backend.

### CI/CD avec GitHub Actions

Le workflow GitHub Actions est configuré pour:
- Tester le backend et le frontend
- Builder les images Docker
- Déployer automatiquement sur Render (backend) et Vercel (frontend)

**Secrets GitHub à configurer:**

Pour Render:
- `RENDER_SERVICE_ID`: ID du service Render
- `RENDER_API_KEY`: Clé API Render

Pour Vercel:
- `VERCEL_TOKEN`: Token Vercel
- `VERCEL_ORG_ID`: ID de l'organisation Vercel
- `VERCEL_PROJECT_ID`: ID du projet Vercel

## 📝 Structure du projet

```
tp-exam-chat/
├── backend/
│   ├── server.js          # Serveur Express
│   ├── test.js            # Tests backend
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── index.html         # Application frontend
│   └── Dockerfile
├── docker-compose.yml
├── .github/
│   └── workflows/
│       └── ci.yml         # Workflow CI/CD
└── README.md
```

## 🔧 Configuration

### Variables d'environnement Backend

- `PORT`: Port du serveur (défaut: 3000)

## 📄 API

### GET /api/messages
Récupère tous les messages.

**Response:**
```json
[
  {
    "id": "1234567890",
    "author": "John",
    "content": "Hello!",
    "timestamp": "2024-01-01T12:00:00.000Z"
  }
]
```

### POST /api/messages
Ajoute un nouveau message.

**Request Body:**
```json
{
  "author": "John",
  "content": "Hello!"
}
```

**Response:**
```json
{
  "id": "1234567890",
  "author": "John",
  "content": "Hello!",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## 📱 Responsive Design

L'interface s'adapte automatiquement aux écrans mobiles et tablettes.

## 🛠️ Technologies

- **Backend:** Node.js, Express, CORS
- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **CI/CD:** GitHub Actions
- **Déploiement:** Vercel (Frontend), Render (Backend)
- **Containerisation:** Docker

