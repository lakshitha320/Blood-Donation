# Blood Donation System (Microservices Architecture)

A microservices-based Blood Donation System with an API Gateway, 5 microservices, and a unified Client Application.

---

## 👥 Member Role & Branch Assignment

| Student | Role | Microservice | Branch Name | Example Endpoints | Key Responsibilities |
|---------|------|--------------|-------------|-------------------|----------------------|
| **1** | **Gateway Lead** | **User & Auth Service** | `gateway` / `auth-service` | `/auth/register`, `/auth/login`, `/auth/profile` | User registration (donors, recipients, hospitals), OAuth 2.0, API Gateway integration, rate limiting, token issuance. |
| **2** | **Member** | **Donor Service** | `donor-service` | `/donors`, `/donors/{id}`, `/donors/history` | Donor records, donation history, eligibility checks. Requires API Key authentication. |
| **3** | **Member** | **Blood Inventory Service** | `inventory-service` | `/inventory`, `/inventory/{bloodType}`, `/inventory/update` | Tracks available blood units by type, stock levels, updates after donations/transfusions. |
| **4** | **Member** | **Request & Matching Service** | `request-service` | `/requests`, `/requests/{id}`, `/requests/match` | Recipient requests, matches donors to recipients based on blood type and location. |
| **5** | **Member** | **Notification Service** | `notification-service` | `/notify/email`, `/notify/sms`, `/notify/alerts` | Sends alerts to donors and hospitals. Requires API Key authentication. |
| **-** | **Frontend** | **Client Application** | `client-app` | React Web / Flutter Mobile App | Donor registration form, blood request submission, inventory dashboard, notifications panel. |

---

## 📁 Repository Folder Structure

```
/
├── gateway/              # User & Auth Service (Spring Cloud Gateway / OAuth 2.0)
├── donor-service/        # Donor Management Microservice
├── inventory-service/    # Blood Inventory Microservice
├── request-service/      # Request & Matching Microservice
├── notification-service/ # Notification Microservice
├── client-app/           # React / Flutter Client Frontend
├── docker-compose.yml    # Root Docker Orchestration
└── README.md             # Project Documentation
```

Each microservice folder must contain:
- `src/` - Source code
- `Dockerfile` - Docker container definition with exposed ports
- `application.yml` - Spring Boot configuration

---

## 🔒 Security & Infrastructure Setup

- **API Gateway**: All requests routed through gateway with OAuth 2.0. Rate limiting per IP/client. CORS configured for client app.
- **Microservices**: API Key authentication enforced. Direct unauthorized calls rejected.
- **Swagger UI**: Available at `http://localhost:808X/swagger-ui.html` for each service.
- **Database**: PostgreSQL with separate databases per service (`donor_db`, `inventory_db`, etc.) or separate schemas.

---

## 🌿 Git Branching Strategy

- `main` - Production-ready code
- `develop` - Integration branch
- Service branches for individual contributions:
  - `gateway`
  - `donor-service`
  - `inventory-service`
  - `request-service`
  - `notification-service`
  - `client-app`
