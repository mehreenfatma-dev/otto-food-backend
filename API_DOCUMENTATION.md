# OTTO Foods Backend API Documentation

## Base URL
```
http://localhost:5000
```

## API Endpoints

### 🍔 Menu Routes

#### Get All Menu Items
```http
GET /api/menu
```

**Query Parameters:**
- `category` (optional): Filter by category (burger, pizza, sandwich, side, drink, dessert)
- `available` (optional): Filter by availability (true/false)

**Response:**
```json
{
  "success": true,
  "count": 12,
  "data": [
    {
      "_id": "...",
      "name": "Classic Burger",
      "description": "Juicy beef patty with lettuce, tomato...",
      "price": 8.99,
      "category": "burger",
      "image": "https://...",
      "available": true,
      "createdAt": "2024-..."
    }
  ]
}
```

#### Create Menu Item
```http
POST /api/menu
Content-Type: application/json

{
  "name": "Veggie Burger",
  "description": "Plant-based burger patty",
  "price": 9.99,
  "category": "burger",
  "image": "https://..."
}
```

#### Update Menu Item
```http
PUT /api/menu/:id
Content-Type: application/json

{
  "price": 10.99,
  "available": false
}
```

#### Delete Menu Item
```http
DELETE /api/menu/:id
```

---

### 📦 Order Routes

#### Get All Orders
```http
GET /api/orders
```

**Query Parameters:**
- `status` (optional): Filter by status (pending, preparing, completed, cancelled)
- `limit` (optional): Limit results (default: 50)

#### Get Single Order
```http
GET /api/orders/:id
```

#### Create Order
```http
POST /api/orders
Content-Type: application/json

{
  "customer": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "555-1234"
  },
  "items": [
    {
      "name": "Classic Burger",
      "price": 8.99,
      "quantity": 2
    },
    {
      "name": "French Fries",
      "price": 4.99,
      "quantity": 1
    }
  ],
  "specialInstructions": "Extra ketchup please"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order placed successfully",
  "data": {
    "_id": "...",
    "customer": {...},
    "items": [...],
    "total": 22.97,
    "status": "pending",
    "createdAt": "..."
  }
}
```

#### Update Order Status
```http
PATCH /api/orders/:id/status
Content-Type: application/json

{
  "status": "preparing"
}
```

Valid statuses: `pending`, `preparing`, `completed`, `cancelled`

#### Cancel Order
```http
DELETE /api/orders/:id
```

---

### 📅 Reservation Routes

#### Get All Reservations
```http
GET /api/reservations
```

**Query Parameters:**
- `status` (optional): Filter by status (pending, confirmed, cancelled)
- `date` (optional): Filter by date (YYYY-MM-DD)

#### Get Single Reservation
```http
GET /api/reservations/:id
```

#### Create Reservation
```http
POST /api/reservations
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "555-5678",
  "date": "2024-12-25",
  "time": "18:00",
  "guests": 4,
  "occasion": "birthday",
  "specialRequests": "Window seat if possible"
}
```

**Validation:**
- `guests`: Must be between 1 and 20
- `date`: Must be today or in the future
- `time`: Must be in HH:MM format
- `occasion`: One of (birthday, anniversary, business, date, family, other)

#### Cancel Reservation
```http
DELETE /api/reservations/:id
```

---

### 💬 Feedback Routes

#### Get All Feedback
```http
GET /api/feedback
```

**Query Parameters:**
- `rating` (optional): Filter by rating (1-5)
- `category` (optional): Filter by category
- `limit` (optional): Limit results (default: 50)

**Response includes statistics:**
```json
{
  "success": true,
  "count": 150,
  "stats": {
    "averageRating": 4.6,
    "totalFeedback": 150,
    "goodCount": 120
  },
  "data": [...]
}
```

#### Get Feedback Statistics
```http
GET /api/feedback/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "averageRating": 4.6,
    "totalFeedback": 150,
    "excellent": 90,
    "good": 40,
    "average": 15,
    "poor": 5
  }
}
```

#### Submit Feedback
```http
POST /api/feedback
Content-Type: application/json

{
  "name": "Bob Johnson",
  "email": "bob@example.com",
  "rating": 5,
  "experience": "good",
  "category": "food",
  "message": "Amazing burgers! The fries were crispy and delicious.",
  "contactPermission": true
}
```

**Validation:**
- `rating`: Must be between 1 and 5
- `experience`: One of (good, average, poor)
- `category`: One of (food, service, delivery, cleanliness, pricing, other)
- `message`: Between 10 and 1000 characters

---

### 👤 User/Auth Routes

#### Register User
```http
POST /api/users/register
Content-Type: application/json

{
  "name": "Alice Wonder",
  "email": "alice@example.com",
  "password": "securepass123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "id": "...",
    "name": "Alice Wonder",
    "email": "alice@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login User
```http
POST /api/users/login
Content-Type: application/json

{
  "email": "alice@example.com",
  "password": "securepass123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": "...",
    "name": "Alice Wonder",
    "email": "alice@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## Error Handling

All errors follow this format:

```json
{
  "success": false,
  "error": "Error message",
  "details": ["Specific error 1", "Specific error 2"]
}
```

### Common Error Codes

- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid credentials/token)
- `404` - Not Found
- `500` - Internal Server Error

### Validation Error Example

```json
{
  "success": false,
  "errors": [
    {
      "msg": "Valid email is required",
      "param": "email",
      "location": "body"
    }
  ]
}
```

---

## Database Models

### User
- `name`: String (required, 2-50 chars)
- `email`: String (required, unique, valid email)
- `password`: String (required, min 6 chars, hashed)
- `createdAt`: Date (auto-generated)

### MenuItem
- `name`: String (required, 2-100 chars)
- `description`: String (required, max 500 chars)
- `price`: Number (required, min 0, max 10000)
- `category`: Enum (burger, pizza, sandwich, side, drink, dessert)
- `image`: String (URL)
- `available`: Boolean (default: true)
- `createdAt`: Date (auto-generated)

### Order
- `customer`: Object (name, email, phone)
- `items`: Array of objects (name, price, quantity)
- `total`: Number (auto-calculated)
- `status`: Enum (pending, preparing, completed, cancelled)
- `specialInstructions`: String (max 500 chars)
- `createdAt`: Date (auto-generated)

### Reservation
- `name`: String (required)
- `email`: String (required, valid email)
- `phone`: String (required)
- `date`: Date (required, today or future)
- `time`: String (required, HH:MM format)
- `guests`: Number (required, 1-20)
- `occasion`: Enum (birthday, anniversary, business, date, family, other)
- `specialRequests`: String (max 500 chars)
- `status`: Enum (pending, confirmed, cancelled)
- `createdAt`: Date (auto-generated)

### Feedback
- `name`: String (required)
- `email`: String (required, valid email)
- `rating`: Number (required, 1-5)
- `experience`: Enum (good, average, poor)
- `category`: Enum (food, service, delivery, cleanliness, pricing, other)
- `message`: String (required, 10-1000 chars)
- `contactPermission`: Boolean (default: false)
- `createdAt`: Date (auto-generated)

---

## Testing with cURL

### Get all menu items
```bash
curl http://localhost:5000/api/menu
```

### Create an order
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer": {
      "name": "Test User",
      "email": "test@example.com",
      "phone": "555-0000"
    },
    "items": [
      {"name": "Burger", "price": 8.99, "quantity": 1}
    ]
  }'
```

### Create a reservation
```bash
curl -X POST http://localhost:5000/api/reservations \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "555-0000",
    "date": "2024-12-25",
    "time": "18:00",
    "guests": 2
  }'
```

### Submit feedback
```bash
curl -X POST http://localhost:5000/api/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "rating": 5,
    "experience": "good",
    "category": "food",
    "message": "Great food and service!"
  }'
```

---

## Environment Variables

Required in `.env` file:

```bash
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your-secret-key-here
```
