# DCS Dental

Plateforme e-commerce pour la vente de matériel dentaire et paramédical, destinée aux professionnels en Tunisie.

| Composant | Technologie |
|-----------|-------------|
| Frontend  | Next.js 16, React 19, Tailwind CSS |
| Backend   | Django 5, Django REST Framework, JWT |
| Base de données | PostgreSQL |
| Tâches async | Celery + Redis |

---

## Structure du projet

```
dcs_dental/
├── backend/                 # API REST Django
│   ├── apps/                # accounts, products, orders, promotions…
│   ├── config/              # settings, urls, celery
│   ├── manage.py
│   └── requirements.txt
├── dcs_dental/
│   └── frontend/            # Application Next.js
├── .env.example             # Variables d'environnement (exemple)
└── README.md
```

---

## Prérequis

Installez les outils suivants sur votre machine :

- **Python** 3.11 ou supérieur
- **Node.js** 20 ou supérieur
- **pnpm** (`npm install -g pnpm`)
- **PostgreSQL** 14+
- **Redis** (optionnel, requis pour Celery en production)

---

## Installation

### 1. Cloner le dépôt

```powershell
git clone <url-du-repo>
cd dcs_dental
```

### 2. Variables d'environnement

Copiez le fichier d'exemple et adaptez les valeurs :

```powershell
copy .env.example .env
copy backend\.env.example backend\.env
```

Pour un développement **local** (sans Docker), modifiez au minimum dans `backend/.env` :

```env
DJANGO_SECRET_KEY=votre-cle-secrete-longue
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1

DB_NAME=dcs_dental
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432

CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/1
```

Créez la base PostgreSQL avant de lancer le backend :

```sql
CREATE DATABASE dcs_dental;
```

---

## Lancer le backend (API Django)

```powershell
cd backend

# Environnement virtuel Python
python -m venv venv
.\venv\Scripts\Activate.ps1

# Dépendances
pip install -r requirements.txt

# Migrations et superutilisateur
python manage.py migrate
python manage.py createsuperuser

# Serveur de développement
python manage.py runserver
```

| Service | URL |
|---------|-----|
| API | http://localhost:8000 |
| Admin Django | http://localhost:8000/admin/ |
| Documentation Swagger | http://localhost:8000/api/docs/ |

### Celery (optionnel)

Dans un second terminal, avec le venv activé :

```powershell
cd backend
.\venv\Scripts\Activate.ps1
celery -A config worker -l info
```

---

## Lancer le frontend (Next.js)

```powershell
cd dcs_dental\frontend

pnpm install
pnpm dev
```

| Service | URL |
|---------|-----|
| Application web | http://localhost:3000 |

Pour une build de production :

```powershell
pnpm build
pnpm start
```

---

## Tests backend

```powershell
cd backend
.\venv\Scripts\Activate.ps1
pytest
```

Avec couverture de code :

```powershell
pytest --cov=apps --cov-report=term-missing
```

---

## Endpoints API principaux

| Route | Description |
|-------|-------------|
| `/api/v1/accounts/` | Authentification et comptes utilisateurs |
| `/api/v1/products/` | Catalogue produits |
| `/api/v1/orders/` | Commandes |
| `/api/v1/promotions/` | Promotions et coupons |
| `/api/docs/` | Documentation interactive (Swagger) |

---

## Dépannage

**Erreur de connexion PostgreSQL** — Vérifiez que PostgreSQL est démarré et que `DB_HOST=localhost` (et non `db`, réservé à Docker).

**Module Django introuvable** — Activez le venv : `.\venv\Scripts\Activate.ps1`

**Port déjà utilisé** — Changez le port :
- Backend : `python manage.py runserver 8001`
- Frontend : `pnpm dev -- -p 3001`

**pnpm non reconnu** — Installez-le : `npm install -g pnpm`, ou utilisez `npm install` puis `npm run dev`.

---

## Licence

Projet académique — TEK-UP University, ING-4-J-SDIA-F-A.
