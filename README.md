
# Ticketing API

A high-performance event ticketing system built with NestJS, PostgreSQL, and Redis for managing events, seats, and customer reservations.

### Overview
The Ticketing API is a RESTful service designed to handle event management, seat reservations, and customer operations with real-time seat availability tracking and temporary hold mechanisms.

## 🚀 Getting Started

### Prerequisites
- Node.js 24.x
- Docker & Docker Compose

### Installation Options

#### Docker Compose
```bash
# Clone and navigate to project
cd ticketing-api

# Start all services (API + PostgreSQL + Redis)
npm run compose:up

# Stop services
npm run compose:down
```

### Prisma Operations
```bash
# Generate client
npm run generate-client

# Run migrations
npm run prisma:migrate

# Reset database (development only)
npm run reset

# Open Prisma Studio
npm run prisma:start
```


### Core Components

#### **API Layer (NestJS + Fastify)**
- **Framework**: NestJS with Fastify adapter for high performance
- **Port**: 3000
- **Documentation**: Swagger UI available at `/api`
- **Validation**: Global validation pipes with class-validator

#### **Database Layer**
- **Primary Database**: PostgreSQL 17
- **ORM**: Prisma
- **Cache Layer**: Redis 8 for seat holds and session management

### Swagger UI
Access interactive API documentation at: [`http://localhost:3000/api`](http://localhost:3000/api)

### Project Structure
```
src/
├── common/types/          # Shared TypeScript types
├── customers/             # Customer module
├── events/                # Events module
├── seats/                 # Seats module
├── prisma/                # Database service
├── redis/                 # Redis service
└── main.ts               # Application entry point
```

#### **Data Models**

```
Event
├── id (UUID)
├── numSeats (10-1000 range)
├── maxNumSeats
├── eventName
├── eventLocation
├── eventDateTimeStamp
├── seatHoldTime
└── seats[] (One-to-Many)

Seat
├── id (UUID)
├── eventId (Foreign Key)
├── price
├── status (OPEN|ON_HOLD|RESERVED)
├── assignedSeating (boolean)
├── customerId
├── row, seatNumber, section
└── event (Many-to-One)

Customer
├── id (UUID)
├── firstName, lastName
├── seatsOnHold[]
├── seatsReserved[]
└── timestamps
```


### Key Features

#### **Seat Hold System**
- Temporary seat reservations using Redis
- Configurable hold time per event
- Automatic expiration and cleanup
- Race condition prevention

#### **Real-time Availability**
- Instant seat status updates
- Concurrent booking protection
- Optimistic locking mechanisms

#### **Scalable Architecture**
- Stateless API design
- Database connection pooling
- Redis-based session management
- Docker containerization

## 🔒 Security Considerations

- Input validation with class-validator
- SQL injection prevention via Prisma
- Environment variable management
- Docker security best practices
- Rate limiting (implement as needed)

## 📈 Performance Features

- Fastify for high throughput
- Redis caching layer
- Database connection pooling
- Optimized Prisma queries
- Docker multi-stage builds
