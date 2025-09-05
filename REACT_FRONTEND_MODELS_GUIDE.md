# YourLuxuryHome React Frontend Models Guide

This comprehensive guide provides all backend model structures, API endpoints, and data formats needed to implement the React frontend for the YourLuxuryHome luxury apartment rental platform.

## Table of Contents
- [API Overview](#api-overview)
- [Authentication System](#authentication-system)
- [Core Data Models](#core-data-models)
- [API Endpoints Reference](#api-endpoints-reference)
- [Model Relationships](#model-relationships)
- [Enums and Choices](#enums-and-choices)
- [File Handling](#file-handling)
- [Validation Rules](#validation-rules)
- [Frontend Model Examples](#frontend-model-examples)

## API Overview

**Base URL:** `http://localhost:8000/api/v1/`  
**Authentication:** JWT Bearer tokens  
**API Documentation:** `http://localhost:8000/api/docs/` (Swagger UI)  
**Media Files:** `http://localhost:8000/media/`

## Authentication System

### User Model
```typescript
interface User {
  id: number;
  email: string;                    // Primary identifier (unique)
  username: string;                 // Username (unique)
  first_name: string;
  last_name: string;
  is_email_verified: boolean;       // Email verification status
  date_joined: string;              // ISO datetime
  is_active: boolean;
}
```

### Profile Model
```typescript
interface Profile {
  user: User;
  phone_number?: string;            // Max 20 chars
  bio?: string;                     // Text field
  photo?: string;                   // Image URL
  created_at: string;               // ISO datetime
  updated_at: string;               // ISO datetime
}
```

### JWT Token Response
```typescript
interface AuthTokens {
  access: string;                   // 60-minute validity
  refresh: string;                  // 7-day validity
}

interface TokenPayload {
  user_id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  exp: number;                      // Expiry timestamp
}
```

## Core Data Models

### 1. Apartment System

#### ApartmentCategory
```typescript
interface ApartmentCategory {
  id: number;
  name: string;                     // Max 100 chars
  description?: string;
}
```

#### ApartmentAmenity
```typescript
interface ApartmentAmenity {
  id: number;
  name: string;                     // Max 100 chars
  description?: string;
  icon?: string;                    // Icon identifier (max 50 chars)
}
```

#### Apartment (List View)
```typescript
interface ApartmentList {
  id: string;                       // UUID
  name: string;                     // Max 200 chars
  slug: string;                     // URL slug (unique)
  description: string;
  address: string;                  // Max 255 chars
  city: string;                     // Max 100 chars
  country: string;                  // Max 100 chars
  price_per_night: string;          // Decimal as string
  bedrooms: number;                 // Positive integer
  bathrooms: number;                // Positive integer
  max_guests: number;               // Positive integer
  category: number;                 // ApartmentCategory ID
  category_name: string;            // Read-only
  primary_image?: ApartmentImage;
  average_rating: number;           // 0-5
  review_count: number;
  amenities_count: number;
  is_available: boolean;
}
```

#### Apartment (Detail View)
```typescript
interface ApartmentDetail {
  id: string;                       // UUID
  name: string;
  slug: string;
  description: string;
  address: string;
  city: string;
  country: string;
  postal_code?: string;             // Max 20 chars
  latitude?: string;                // Decimal as string
  longitude?: string;               // Decimal as string
  price_per_night: string;          // Decimal as string
  bedrooms: number;
  bathrooms: number;
  max_guests: number;
  size_sqm?: number;                // Square meters
  category: ApartmentCategory;
  amenities: ApartmentAmenity[];
  included_services: ServiceList[];
  images: ApartmentImage[];
  reviews: ApartmentReview[];
  average_rating: number;
  review_count: number;
  is_available: boolean;
  is_booked: boolean;               // Context-dependent
  created_at: string;
  updated_at: string;
}
```

#### ApartmentImage
```typescript
interface ApartmentImage {
  id: number;
  image: string;                    // Image URL
  caption?: string;                 // Max 200 chars
  is_primary: boolean;
}
```

#### ApartmentReview
```typescript
interface ApartmentReview {
  id: number;
  user: number;                     // User ID
  user_name: string;                // Computed field
  rating: number;                   // 1-5
  comment: string;
  created_at: string;
}
```

#### ApartmentAvailability
```typescript
interface ApartmentAvailability {
  id: number;
  apartment: string;                // Apartment UUID
  apartment_name: string;           // Read-only
  date: string;                     // YYYY-MM-DD
  status: 'available' | 'pending' | 'booked' | 'maintenance';
  status_display: string;           // Human readable
  price_override?: string;          // Decimal, overrides default price
  effective_price: string;          // Computed final price
  notes?: string;
  created_at: string;
  updated_at: string;
}
```

### 2. Virtual Tour System

#### VirtualTourRoom
```typescript
interface VirtualTourRoom {
  id: number;
  name: string;                     // Max 100 chars
  room_type: 'living_room' | 'bedroom' | 'kitchen' | 'bathroom' | 
            'dining_room' | 'balcony' | 'terrace' | 'office' | 
            'hallway' | 'entrance' | 'other';
  panoramic_image: string;          // Image URL
  panoramic_image_url: string;      // Full URL with domain
  description?: string;
  order: number;                    // Display order
  is_starting_room: boolean;
  initial_yaw: number;              // Degrees (horizontal)
  initial_pitch: number;            // Degrees (vertical)
  connections_from: RoomConnection[];
  hotspots: VirtualTourHotspot[];
}
```

#### RoomConnection
```typescript
interface RoomConnection {
  id: number;
  to_room: number;                  // Target room ID
  to_room_name: string;             // Read-only
  to_room_type: string;             // Read-only
  hotspot_x: number;                // 0.0-100.0 percentage
  hotspot_y: number;                // 0.0-100.0 percentage
  direction_label?: string;         // Max 50 chars
  icon: string;                     // Default: 'door'
  hotspot_size: number;             // Pixels, default: 50
  hotspot_color: string;            // Hex color, default: '#d9b38a'
  transition_yaw: number;           // Target viewing angle
  transition_pitch: number;         // Target pitch angle
  transition_animation: 'fade' | 'slide' | 'zoom';
  is_active: boolean;
  show_on_hover: boolean;
  pulse_animation: boolean;
}
```

#### VirtualTourHotspot
```typescript
interface VirtualTourHotspot {
  id: number;
  hotspot_type: 'navigation' | 'info' | 'feature' | 'amenity';
  position_x: number;               // 0.0-1.0 normalized
  position_y: number;               // 0.0-1.0 normalized
  title: string;                    // Max 100 chars
  description?: string;
  icon?: string;                    // Max 50 chars
  connected_room?: number;          // Room ID for navigation type
  is_active: boolean;
}
```

#### VirtualTour (Complete Tour Data)
```typescript
interface VirtualTour {
  apartment_id: string;             // UUID
  apartment_name: string;
  rooms: VirtualTourRoom[];
  starting_room: VirtualTourRoom;
  room_count: number;
}
```

### 3. Services System

#### ServiceType
```typescript
interface ServiceType {
  id: number;
  name: string;                     // Max 100 chars
  description?: string;
  icon?: string;                    // Max 50 chars
  order: number;                    // Display order
  service_count: number;            // Count of active services
}
```

#### ServiceList
```typescript
interface ServiceList {
  id: string;                       // UUID
  name: string;                     // Max 200 chars
  description?: string;
  price: string;                    // Decimal as string
  type: number;                     // ServiceType ID
  type_name: string;                // Read-only
  icon?: string;                    // Max 50 chars
  is_free: boolean;                 // Computed: price == 0
  is_featured: boolean;
  unit_label: string;               // Default: 'unit'
}
```

#### ServiceDetail
```typescript
interface ServiceDetail {
  id: string;                       // UUID
  name: string;
  description?: string;
  price: string;                    // Decimal as string
  type: ServiceType;
  icon?: string;
  is_active: boolean;
  is_featured: boolean;
  max_quantity: number;             // Default: 1
  unit_label: string;
  is_free: boolean;                 // Computed
  created_at: string;
  updated_at: string;
}
```

#### ServiceTypeWithServices
```typescript
interface ServiceTypeWithServices {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  order: number;
  services: ServiceList[];          // Only active services
}
```

### 4. Reservation System

#### ReservationService
```typescript
interface ReservationService {
  id: number;
  service: string;                  // Service UUID
  service_name: string;             // Read-only
  service_description?: string;     // Read-only
  quantity: number;                 // Default: 1
  price?: string;                   // Computed at creation
  notes?: string;
}
```

#### Reservation
```typescript
interface Reservation {
  id: string;                       // UUID
  user: number;                     // User ID
  user_email: string;               // Read-only
  user_name: string;                // "First Last"
  apartment: string;                // Apartment UUID
  apartment_name: string;           // Read-only
  check_in_date: string;            // YYYY-MM-DD
  check_out_date: string;           // YYYY-MM-DD
  guests: number;                   // Default: 1
  total_price?: string;             // Computed decimal
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  status_display: string;           // Human readable
  special_requests?: string;
  whatsapp_number?: string;         // Max 20 chars
  duration: number;                 // Days between dates
  services: ReservationService[];
  created_at: string;
  updated_at: string;
}
```

## API Endpoints Reference

### Authentication Endpoints

#### User Registration
```
POST /api/v1/users/register/
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "username", 
  "password": "securepassword",
  "password2": "securepassword",
  "first_name": "John",
  "last_name": "Doe"
}
```

#### JWT Token Obtain
```
POST /api/v1/users/token/
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}

Response: { "access": "...", "refresh": "..." }
```

#### JWT Token Refresh
```
POST /api/v1/users/token/refresh/
Content-Type: application/json

{
  "refresh": "refresh_token_here"
}

Response: { "access": "new_access_token" }
```

#### User Profile
```
GET /api/v1/users/me/
Authorization: Bearer {access_token}

PATCH /api/v1/users/me/profile/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "phone_number": "+1234567890",
  "bio": "Travel enthusiast",
  "first_name": "John",
  "last_name": "Doe"
}
```

### Apartment Endpoints

#### List Apartments
```
GET /api/v1/apartments/
Query Parameters:
  - city: string (filter)
  - category: number (category ID)
  - min_price: decimal
  - max_price: decimal
  - bedrooms: number
  - guests: number
  - amenities: comma-separated amenity IDs
  - check_in_date: YYYY-MM-DD
  - check_out_date: YYYY-MM-DD
  - search: string (name, description, address)
  - page: number
  - page_size: number (default 20)
```

#### Get Apartment Detail
```
GET /api/v1/apartments/{id}/
Query Parameters:
  - check_in_date: YYYY-MM-DD (for availability check)
  - check_out_date: YYYY-MM-DD (for availability check)
```

#### Apartment Categories
```
GET /api/v1/apartments/categories/
```

#### Apartment Amenities
```
GET /api/v1/apartments/amenities/
```

#### Apartment Images
```
GET /api/v1/apartments/{apartment_id}/images/
POST /api/v1/apartments/{apartment_id}/images/
Content-Type: multipart/form-data

{
  "image": file,
  "caption": "string",
  "is_primary": boolean
}
```

#### Apartment Reviews
```
GET /api/v1/apartments/{apartment_id}/reviews/
POST /api/v1/apartments/{apartment_id}/reviews/
Authorization: Bearer {access_token}

{
  "rating": 5,
  "comment": "Excellent apartment!"
}
```

#### Virtual Tour
```
GET /api/v1/apartments/{apartment_id}/virtual-tour/

Response: VirtualTour object with all rooms and connections
```

#### Individual Room
```
GET /api/v1/apartments/{apartment_id}/virtual-tour/rooms/{room_id}/

Response: VirtualTourRoom with connections and hotspots
```

### Service Endpoints

#### List Services
```
GET /api/v1/services/
Query Parameters:
  - type: number (service type ID)
  - is_featured: boolean
  - is_free: boolean
  - search: string
```

#### Service Types with Services
```
GET /api/v1/services/types/
GET /api/v1/services/types/{id}/
GET /api/v1/services/types/{id}/services/
```

#### Service Detail
```
GET /api/v1/services/{id}/
```

### Reservation Endpoints

#### Create Reservation
```
POST /api/v1/reservations/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "apartment": "apartment-uuid",
  "check_in_date": "2024-01-15",
  "check_out_date": "2024-01-20",
  "guests": 2,
  "special_requests": "Late check-in please",
  "whatsapp_number": "+1234567890",
  "services": ["service-uuid-1", "service-uuid-2"]
}
```

#### List User Reservations
```
GET /api/v1/users/{user_id}/reservations/
Authorization: Bearer {access_token}
Query Parameters:
  - status: reservation status
  - ordering: -created_at (default)
```

#### Get Reservation Detail
```
GET /api/v1/reservations/{id}/
Authorization: Bearer {access_token}
```

#### Update Reservation
```
PATCH /api/v1/reservations/{id}/
Authorization: Bearer {access_token}

{
  "guests": 3,
  "special_requests": "Updated requests",
  "status": "confirmed"
}
```

## Model Relationships

### Apartment Relationships
- **Apartment** → **ApartmentCategory** (ForeignKey)
- **Apartment** ↔ **ApartmentAmenity** (ManyToMany)
- **Apartment** ↔ **Service** (ManyToMany - included_services)
- **Apartment** → **ApartmentImage** (One-to-Many)
- **Apartment** → **ApartmentReview** (One-to-Many)
- **Apartment** → **ApartmentAvailability** (One-to-Many)
- **Apartment** → **VirtualTourRoom** (One-to-Many)
- **Apartment** → **Reservation** (One-to-Many)

### Virtual Tour Relationships
- **VirtualTourRoom** → **Apartment** (ForeignKey)
- **RoomConnection** → **VirtualTourRoom** (from_room, to_room)
- **VirtualTourHotspot** → **VirtualTourRoom** (ForeignKey)

### Reservation Relationships
- **Reservation** → **User** (ForeignKey)
- **Reservation** → **Apartment** (ForeignKey)
- **ReservationService** → **Reservation** (ForeignKey)
- **ReservationService** → **Service** (ForeignKey)

### Service Relationships
- **Service** → **ServiceType** (ForeignKey)

## Enums and Choices

### Reservation Status
```typescript
type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
```

### Availability Status
```typescript
type AvailabilityStatus = 'available' | 'pending' | 'booked' | 'maintenance';
```

### Room Types
```typescript
type RoomType = 'living_room' | 'bedroom' | 'kitchen' | 'bathroom' | 
               'dining_room' | 'balcony' | 'terrace' | 'office' | 
               'hallway' | 'entrance' | 'other';
```

### Hotspot Types
```typescript
type HotspotType = 'navigation' | 'info' | 'feature' | 'amenity';
```

### Transition Animations
```typescript
type TransitionAnimation = 'fade' | 'slide' | 'zoom';
```

### Review Ratings
```typescript
type Rating = 1 | 2 | 3 | 4 | 5;
```

## File Handling

### Image Upload Fields
- **ApartmentImage.image**: `apartment_images/`
- **VirtualTourRoom.panoramic_image**: `virtual_tour/panoramas/`
- **Profile.photo**: `profile_photos/`

### Image URLs
All image fields return relative URLs. Prepend the base URL:
```typescript
const getFullImageUrl = (imagePath: string) => {
  return `http://localhost:8000${imagePath}`;
};
```

### Virtual Tour Image Validation
- **Aspect Ratio**: 2:1 (equirectangular)
- **Minimum Resolution**: 2048x1024 pixels
- **Maximum File Size**: 10MB
- **Formats**: Standard image formats (JPEG, PNG recommended)

## Validation Rules

### Date Validation
- **Check-in Date**: Cannot be in the past
- **Check-out Date**: Must be after check-in date
- **Availability Dates**: Cannot set availability for past dates

### Price Validation
- All prices are stored as decimals with 2 decimal places
- Maximum value: 99,999,999.99

### String Length Limits
- **Email**: 254 characters
- **Name fields**: 200 characters max
- **Address**: 255 characters max
- **Phone numbers**: 20 characters max
- **Captions**: 200 characters max
- **Icons**: 50 characters max

### Number Constraints
- **Ratings**: 1-5 only
- **Guests/Bedrooms/Bathrooms**: Positive integers only
- **Hotspot Positions**: 0.0-100.0 for percentage, 0.0-1.0 for normalized

### Unique Constraints
- **User email**: Must be unique
- **User username**: Must be unique
- **Apartment slug**: Must be unique
- **Apartment + Date**: Unique together for availability
- **User + Apartment**: One review per user per apartment

## Frontend Model Examples

### TypeScript Interfaces
```typescript
// API Response wrapper
interface ApiResponse<T> {
  results: T[];
  count: number;
  next?: string;
  previous?: string;
}

// Error response
interface ApiError {
  detail?: string;
  [field: string]: string[] | string;
}

// Complete apartment search result
interface ApartmentSearchResult extends ApiResponse<ApartmentList> {
  filters: {
    cities: string[];
    categories: ApartmentCategory[];
    amenities: ApartmentAmenity[];
    price_range: { min: number; max: number };
  };
}

// Reservation with computed fields
interface ReservationWithDetails extends Reservation {
  apartment_details: ApartmentList;
  can_cancel: boolean;
  can_review: boolean;
  days_until_checkin: number;
}
```

### React State Management Examples
```typescript
// Apartment state
interface ApartmentState {
  apartments: ApartmentList[];
  currentApartment?: ApartmentDetail;
  virtualTour?: VirtualTour;
  loading: boolean;
  error?: string;
  filters: {
    city?: string;
    category?: number;
    minPrice?: number;
    maxPrice?: number;
    checkIn?: string;
    checkOut?: string;
  };
  pagination: {
    page: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

// User state
interface UserState {
  user?: User;
  profile?: Profile;
  tokens?: AuthTokens;
  reservations: Reservation[];
  isAuthenticated: boolean;
  loading: boolean;
}

// Service state  
interface ServiceState {
  serviceTypes: ServiceTypeWithServices[];
  selectedServices: string[]; // UUIDs
  loading: boolean;
}
```

### API Service Examples
```typescript
// Base API configuration
const API_BASE_URL = 'http://localhost:8000/api/v1';

class ApiService {
  private baseURL = API_BASE_URL;
  
  private getHeaders(includeAuth = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (includeAuth) {
      const token = localStorage.getItem('access_token');
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return headers;
  }

  async getApartments(params?: ApartmentFilters): Promise<ApiResponse<ApartmentList>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const response = await fetch(`${this.baseURL}/apartments/?${searchParams}`, {
      headers: this.getHeaders(false),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch apartments');
    }
    
    return response.json();
  }

  async getVirtualTour(apartmentId: string): Promise<VirtualTour> {
    const response = await fetch(`${this.baseURL}/apartments/${apartmentId}/virtual-tour/`, {
      headers: this.getHeaders(false),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch virtual tour');
    }
    
    return response.json();
  }

  async createReservation(reservation: Partial<Reservation>): Promise<Reservation> {
    const response = await fetch(`${this.baseURL}/reservations/`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(reservation),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to create reservation');
    }
    
    return response.json();
  }
}
```

## Best Practices

### 1. Error Handling
- Always handle network errors and API errors
- Validate form data before submission
- Show user-friendly error messages
- Implement retry logic for failed requests

### 2. Performance
- Implement pagination for long lists
- Lazy load images and virtual tour data
- Cache frequently accessed data
- Debounce search inputs

### 3. User Experience
- Show loading states during API calls
- Implement optimistic updates where appropriate
- Provide clear feedback for user actions
- Handle offline scenarios gracefully

### 4. Security
- Never store JWT tokens in localStorage in production
- Implement token refresh logic
- Validate user permissions on sensitive actions
- Sanitize user inputs

### 5. Data Management
- Use consistent data structures
- Normalize related data to prevent duplication
- Implement proper state management (Redux/Zustand)
- Handle real-time updates if needed

---

This guide provides the complete data model structure needed to build the React frontend. All field types, relationships, and API endpoints are documented to ensure perfect alignment between frontend and backend systems.