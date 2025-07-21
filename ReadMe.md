# 🏡 YourLuxuryHome - Real Estate Rental App

Welcome to **YourLuxuryHome**, a multi-platform application for **luxury apartment rentals**. The system includes:

* 📱 A **mobile app** (Flutter)
* 🌐 A **web app** (React)
* 🧠 A **backend API** (Django REST Framework)

This README also serves as a **cahier des charges** (specification document) for both humans and AI agents.

---

## 📌 Purpose

Create an application for renting **high-end luxury apartments**, each with rich details, exclusive services, and seasonal availability. Reservations will be submitted (for now) via **WhatsApp integration**.

---

## 🔄 Recent Backend Enhancements

### 🔐 Authentication & User Management
* JWT-based authentication with token refresh
* Email verification for new user registrations
* Password reset functionality with email notifications
* Custom HTML email templates for better user experience

### 🔍 API Improvements
* Nested routes for related resources (e.g., user reservations)
* Advanced filtering for apartments (location, price range, amenities)
* Pagination for listing endpoints with customizable page sizes
* Permission-based access control for all endpoints

### 📊 Data Organization
* Structured service types and services
* Apartment-service relationships for included amenities
* User profile management
* Reservation tracking and history

---

## 🧱 Core Features

### 🏠 Home (Apartments Listing)

* List all available apartments
* Show:

  * Name
  * Price per night
  * Features / Amenities / Facilities
  * Number of bedrooms, beds, bathrooms, rooms
  * Type (e.g. Entire Place / Apartment)
  * Included services

### 🧰 Services Page

* Services are grouped **horizontally by type**
* Each service:

  * Belongs to a **type** (e.g. Transport, Wellness)
  * Has a **name**
  * Has a **price** (or zero if included)

### 🕓 Availability Calendar

* Show monthly calendar (Juillet 2025, Août 2025...)
* Marked dates: Available / Pending / Booked

### 📆 Reservation

* Form with:

  * Personal information (name, email, phone)
  * Apartment choice
  * Stay duration
  * Optional services (checkboxes)
* Send collected info to WhatsApp

### 👤 Profile & Auth

* Basic login/register (to manage history)
* View past reservations

---

## 🗄️ Backend Models (Django)

### `Apartment`

| Field               | Type                     | Notes             |
| ------------------- | ------------------------ | ----------------- |
| `id`                | AutoField                | Primary key       |
| `name`              | CharField                |                   |
| `price_per_night`   | DecimalField             |                   |
| `bedrooms`          | IntegerField             |                   |
| `beds`              | IntegerField             |                   |
| `bathrooms`         | IntegerField             |                   |
| `rooms`             | IntegerField             |                   |
| `type`              | CharField                | e.g. Entire Place |
| `features`          | TextField                |                   |
| `amenities`         | TextField                |                   |
| `facilities`        | TextField                |                   |
| `included_services` | ManyToManyField(Service) |                   |

### `ServiceType`

| Field  | Type      | Notes                    |
| ------ | --------- | ------------------------ |
| `id`   | AutoField |                          |
| `name` | CharField | e.g. Transport, Wellness |

### `Service`

| Field   | Type                    | Notes         |
| ------- | ----------------------- | ------------- |
| `id`    | AutoField               |               |
| `name`  | CharField               |               |
| `price` | DecimalField            | 0 if included |
| `type`  | ForeignKey(ServiceType) |               |

### `Reservation`

| Field                   | Type                     | Notes         |
| ----------------------- | ------------------------ | ------------- |
| `id`                    | AutoField                |               |
| `user`                  | ForeignKey(User)         |               |
| `apartment`             | ForeignKey(Apartment)    |               |
| `start_date`            | DateField                |               |
| `end_date`              | DateField                |               |
| `services`              | ManyToManyField(Service) |               |
| `submitted_to_whatsapp` | BooleanField             | default=False |

### `Availability`

| Field       | Type                  | Notes                            |
| ----------- | --------------------- | -------------------------------- |
| `apartment` | ForeignKey(Apartment) |                                  |
| `date`      | DateField             |                                  |
| `status`    | CharField             | 'available', 'pending', 'booked' |

### `User`

| Field      | Type       | Notes                           |
| ---------- | ---------- | ------------------------------- |
| `username` | CharField  |                                 |
| `email`    | EmailField |                                 |
| `phone`    | CharField  |                                 |
| `password` | CharField  | hashed                          |
| `role`     | CharField  | 'guest', 'admin', 'staff', etc. |

---

## ⚙️ Functionalities Summary

| Module      | Features                                                         |
| ----------- | ---------------------------------------------------------------- |
| Apartment   | CRUD, search, filter by price/type                               |
| Service     | Group by type, select services, show included vs optional        |
| Reservation | Fill form, select services, availability check, send to WhatsApp |
| Auth        | Register, Login, Profile (view reservation history)              |
| Admin       | Add/edit apartments, services, manage availability               |

---

## 🔌 Technologies

| Layer         | Stack                                                 |
| ------------- | ----------------------------------------------------- |
| Mobile        | Flutter                                               |
| Web           | React.js                                              |
| Backend       | Django + Django REST Framework                        |
| Database      | MySQL                                                 |
| Authentication| JWT (djangorestframework-simplejwt) + Djoser          |
| API Features  | Nested Routers, Filtering, Pagination, Email Verification |
| Communication | WhatsApp API (manual message trigger) |

---

## 🗂 Example API Endpoints

```
GET /api/apartments/
GET /api/apartments/1/
GET /api/services/           → grouped by type
POST /api/reservations/      → create new reservation
GET /api/availability/?month=2025-07
```

---

## ✅ MVP Roadmap

1. [x] Apartment model and listing
2. [x] Service model and grouping
3. [x] Availability calendar system
4. [x] Reservation + WhatsApp form
5. [x] User authentication + profile
6. [ ] Admin panel and dashboard
7. [ ] Payment integration (future phase)

---

## 🔐 Admin Roles (Later phase)

* Add/edit apartments
* Add/edit services and types
* Update availability per day
* View/export reservations

---

## 🤖 AI Agent Instructions (Windsurf / AI Assistants)

* Monitor `/api/reservations/` endpoint
* Trigger WhatsApp message upon reservation
* Auto-update availability calendar
* Notify admin of new pending requests

---

## 📎 Notes

* No online payment integration in MVP
* WhatsApp acts as communication gateway for now
* Future: add real-time calendar sync, payment, client dashboard

---

## 📧 Contact

For questions, reach out to `admin@yourluxuryhome.com` or via the team WhatsApp.

---

This file can be used by all project contributors, AI agents (e.g. Windsurf), and future developers to understand the structure and logic of the app clearly.
