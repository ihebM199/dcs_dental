# DCS Dental — Complete Backend Implementation Plan

## Project Overview
Build a full Django 5 REST backend for the DCS Dental e-commerce platform (dental & paramedical equipment store targeting Tunisian dental professionals). The frontend is a Next.js 16 app with static data that needs to be served dynamically via the API.

## Frontend Analysis Summary

### Data Models Identified
- **Product**: id, name, slug, brand, category, price, oldPrice, rating, reviewCount, stock, stockMax, image, images[], description, details[], isNew, isPromo, isBestSeller
- **Category**: id, name, slug, count
- **Brand**: id, name
- **CartItem**: product, qty
- **Testimonial/Review**: id, name, role, rating, text
- **Coupon**: code, description, discountPct, expires
- **Roles**: Dentiste, Prothésiste dentaire, Étudiant en prothèse dentaire, Étudiant en médecine dentaire

### Frontend Routes
- `/` — Home page
- `/catalogue` — Product catalog (with `?cat=` filter)
- `/promotions` — Promotions page
- `/produit/{slug}` — Product detail
- `/checkout` — Cart/checkout
- `/login` — Login
- `/dashboard` — User dashboard
- `/support` — Support/help
- `/admin` — Admin panel

### Currency: TND (Tunisian Dinar)

---

## Architecture

```
dcs_dental/
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── pytest.ini
│   ├── .env.example
│   ├── config/               # Django project settings
│   │   ├── __init__.py
│   │   ├── settings/
│   │   │   ├── __init__.py
│   │   │   ├── base.py
│   │   │   ├── development.py
│   │   │   └── production.py
│   │   ├── urls.py
│   │   ├── wsgi.py
│   │   ├── asgi.py
│   │   └── celery.py
│   └── apps/
│       ├── accounts/
│       ├── products/
│       ├── orders/
│       ├── promotions/
│       ├── inventory/
│       ├── invoices/
│       ├── delivery/
│       ├── reviews/
│       ├── support/
│       └── notifications/
├── docker-compose.yml
├── frontend/                # Existing Next.js frontend
│   └── Dockerfile
└── README.md
```

## Proposed Changes

### 1. Core Configuration (`backend/config/`)

#### [NEW] `backend/config/settings/base.py`
- Custom User model (accounts.User)
- DRF configuration with JWT
- PostgreSQL database
- Celery + Redis config
- CORS, CSRF, rate limiting
- Media/static file config
- Email (SMTP) settings
- Swagger (drf-spectacular) config

#### [NEW] `backend/config/urls.py`
- API versioned routes under `/api/v1/`
- Swagger docs at `/api/docs/`
- Media serving in dev

#### [NEW] `backend/config/celery.py`
- Celery app configuration with Redis broker

---

### 2. Accounts App (`backend/apps/accounts/`)
- Custom User model with roles (USER, ADMIN, SUPER_ADMIN)
- Profile fields: phone, location, profession (DENTIST, DENTAL_PROSTHETIST, PROSTHESIS_STUDENT, DENTAL_MEDICINE_STUDENT)
- JWT auth (register, login, refresh)
- User profile CRUD

---

### 3. Products App (`backend/apps/products/`)
- Models: Category, Brand, Product, ProductImage, ProductDetail
- Full CRUD with admin permissions
- Search, filter by category/brand
- Slug-based lookup
- Flags: is_new, is_promo, is_best_seller

---

### 4. Orders App (`backend/apps/orders/`)
- Models: Order, OrderItem
- Status workflow: PENDING → CONFIRMED → SHIPPING → DELIVERED / CANCELLED
- Create order from cart
- Cancel order
- Order history per user

---

### 5. Promotions App (`backend/apps/promotions/`)
- Model: PromoCode (code, discount_percentage, expiration, active, category-specific)
- Validate and apply promo codes

---

### 6. Inventory App (`backend/apps/inventory/`)
- Model: StockMovement (product, quantity_change, reason, timestamp)
- Real-time stock tracking via signals
- Stock alerts for low-stock products

---

### 7. Invoices App (`backend/apps/invoices/`)
- Model: Invoice
- Auto-generate PDF with unit prices
- Linked to Order

---

### 8. Delivery App (`backend/apps/delivery/`)
- Model: DeliveryNote
- Auto-generate PDF without unit prices (total only)
- Linked to Order

---

### 9. Reviews App (`backend/apps/reviews/`)
- Model: Review (product, user, rating, comment)
- Aggregate ratings on product

---

### 10. Support App (`backend/apps/support/`)
- Models: Ticket, TicketMessage
- Status: OPEN, IN_PROGRESS, RESOLVED, CLOSED
- User and admin messaging

---

### 11. Notifications App (`backend/apps/notifications/`)
- Models: Notification, EmailLog
- Celery tasks for async email sending
- Order notification emails (to admin + customer)
- Email history (pending/sent/failed) with retry
- Configurable admin notification email

---

### 12. Docker Setup
- `docker-compose.yml` with frontend, backend, postgres, redis, celery, celery-beat
- Backend Dockerfile (Python 3.12)
- Frontend Dockerfile (Node 20)
- Volumes, healthchecks, environment variables

---

### 13. Testing
- pytest + pytest-django
- Factory Boy for test data
- Tests for each app: models, serializers, views

---

## Verification Plan

### Automated Tests
```bash
docker compose exec backend pytest --tb=short -q
```

### Manual Verification
- `docker compose up --build` single command deployment
- Swagger UI at `/api/docs/`
- All CRUD endpoints functional
