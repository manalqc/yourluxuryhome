# YourLuxuryHome Backend API

## 🌟 Overview

This is the backend API for YourLuxuryHome, a luxury real estate rental platform. Built with Django REST Framework, it provides a robust, secure, and feature-rich API for managing luxury apartment rentals, user accounts, reservations, and services.

## 🛠️ Tech Stack

- **Framework**: Django 4.2 + Django REST Framework 3.14
- **Authentication**: JWT (djangorestframework-simplejwt) + Djoser
- **Database**: MySQL
- **API Features**: Nested Routers, Filtering, Pagination, Email Verification
- **Communication**: WhatsApp API integration

## 🏗️ Project Structure

```
yourluxuryhome/
├── apps/
│   ├── apartments/     # Apartment listings and availability
│   ├── common/         # Shared utilities and pagination
│   ├── reservations/   # Booking management
│   ├── services/       # Service types and offerings
│   └── users/          # Authentication and user profiles
├── yourluxuryhome/     # Project settings
└── manage.py
```

## 📋 Core Features

### 🔐 Authentication & User Management

- **JWT Authentication**: Secure token-based authentication with refresh capabilities
- **Email Verification**: Account activation via email for new registrations
- **Password Reset**: Self-service password recovery with email notifications
- **Custom Email Templates**: HTML templates for all system emails
- **User Profiles**: Extended user information with profile management

### 🏠 Apartment Management

- **CRUD Operations**: Create, read, update, and delete apartment listings
- **Advanced Filtering**: Filter by location, price range, amenities, and more
- **Included Services**: Associate services with apartments
- **Media Management**: Support for apartment images (planned)
- **Availability Tracking**: Calendar-based availability system (planned)

### 📅 Reservation System

- **Booking Creation**: Make reservations for specific date ranges
- **Service Selection**: Add optional services to bookings
- **User Association**: Link reservations to user accounts
- **WhatsApp Integration**: Submit reservation details via WhatsApp
- **Reservation History**: View past and upcoming bookings

### 🧰 Services Framework

- **Service Types**: Categorize services (Transport, Wellness, etc.)
- **Pricing**: Set prices for optional services
- **Included Services**: Mark services as included with specific apartments
- **Service Selection**: Add services to reservations

### 🔍 API Features

- **Nested Routes**: Clean URL structure for related resources
- **Pagination**: Customizable pagination for all listing endpoints
- **Permissions**: Role-based access control for all endpoints
- **Rate Limiting**: API throttling for security (planned)
- **Audit Logging**: Track changes to critical data (planned)

## 🚀 Getting Started

### Prerequisites

- Python 3.9+
- MySQL
- Virtual environment (recommended)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/yourluxuryhome.git
cd yourluxuryhome/backend
```

2. Create and activate a virtual environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies
```bash
pip install -r requirements.txt
```

4. Set up environment variables
```bash
# Create a .env file in the project root with the following variables
SECRET_KEY=your_secret_key
DEBUG=True
DATABASE_URL=mysql://user:password@localhost:3306/yourluxuryhome
EMAIL_HOST_USER=your_email@example.com
EMAIL_HOST_PASSWORD=your_email_password
DEFAULT_FROM_EMAIL=noreply@yourluxuryhome.com
```

5. Run migrations
```bash
python manage.py migrate
```

6. Create a superuser
```bash
python manage.py createsuperuser
```

7. Start the development server
```bash
python manage.py runserver
```

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/users/register/`: Register a new user
- `POST /api/users/login/`: Log in and get JWT tokens
- `POST /api/users/logout/`: Log out (blacklist token)
- `POST /api/users/token/`: Obtain JWT token pair
- `POST /api/users/token/refresh/`: Refresh JWT token
- `POST /api/users/password-reset/`: Request password reset
- `POST /api/users/password-reset/confirm/`: Confirm password reset
- `POST /api/users/activate/`: Activate user account

### User Endpoints

- `GET /api/users/profile/`: Get user profile
- `PUT /api/users/profile/`: Update user profile
- `GET /api/users/{id}/reservations/`: List user's reservations

### Apartment Endpoints

- `GET /api/apartments/`: List all apartments
- `POST /api/apartments/`: Create a new apartment (admin only)
- `GET /api/apartments/{id}/`: Get apartment details
- `PUT /api/apartments/{id}/`: Update apartment (admin only)
- `DELETE /api/apartments/{id}/`: Delete apartment (admin only)
- `GET /api/apartments/{id}/reservations/`: List apartment reservations

### Service Endpoints

- `GET /api/services/types/`: List all service types
- `GET /api/services/`: List all services
- `GET /api/services/types/{id}/services/`: List services by type

### Reservation Endpoints

- `POST /api/reservations/`: Create a new reservation
- `GET /api/reservations/{id}/`: Get reservation details
- `GET /api/reservations/`: List all reservations (admin only)

## 🔒 Environment Variables

| Variable | Description | Example |
|----------|-------------|--------|
| `SECRET_KEY` | Django secret key | `django-insecure-...` |
| `DEBUG` | Debug mode | `True` or `False` |
| `DATABASE_URL` | Database connection string | `mysql://user:password@localhost:3306/yourluxuryhome` |
| `EMAIL_HOST_USER` | SMTP username | `your_email@gmail.com` |
| `EMAIL_HOST_PASSWORD` | SMTP password | `your_app_password` |
| `DEFAULT_FROM_EMAIL` | Default sender email | `noreply@yourluxuryhome.com` |
| `FRONTEND_URL` | Frontend application URL | `http://localhost:3000` |

## 🧪 Testing

Run tests with pytest:

```bash
pytest
```

Generate coverage report:

```bash
pytest --cov=apps
```

## 📝 Future Enhancements

- Calendar availability system for apartments
- Media upload for profile pictures and apartment images
- HTML email templates for all notifications
- Audit logging or soft deletion for critical data
- API rate limiting for security
- Django signals for automated profile creation

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
