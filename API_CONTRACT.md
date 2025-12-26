# API CONTRACT — Fullstack Website Backend

Base URL: /api  
Authentication: JWT (Authorization: Bearer <token>)

---

## 1. Authentication APIs

### 1.1 Register User
POST /api/auth/register

Request Body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "********"
}
