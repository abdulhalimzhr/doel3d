# DOEL 3D - STL Print Cost Calculator

A comprehensive 3D printing cost estimation platform built with modern web technologies. Upload STL files, configure print settings, and get accurate cost estimates for your 3D printing projects.

## 🚀 Tech Stack

- **Backend**: [NestJS](https://nestjs.com/) - Progressive Node.js framework
- **Database**: [Prisma](https://prisma.io/) ORM with PostgreSQL (Docker)
- **API**: [GraphQL](https://graphql.org/) with Apollo Server
- **Frontend**: [Next.js](https://nextjs.org/) - React framework (in development)
- **Infrastructure**: Docker Compose for database management

## ✨ Features

- **STL File Upload**: Upload and parse STL files to extract volume and weight data
- **Cost Estimation**: Calculate material costs, printing time, and total costs
- **Material Support**: PLA and PETG material options with different pricing
- **Print Settings**: Configurable layer height, wall count, infill percentage, and more
- **Order Management**: Create and track printing orders with unique order IDs
- **GraphQL API**: Modern API with type-safe queries and mutations
- **Environment Management**: Easy switching between dev/prod environments
- **Data Persistence**: Permanent PostgreSQL storage with Docker volumes

## 📋 Prerequisites

- Node.js 18.0.0 or higher
- Docker Desktop (for PostgreSQL database)
- npm or yarn package manager

## � Quick Start

### **One-Command Setup**

```bash
git clone git@github.com:abdulhalimzhr/doel3d.git
cd doel3d/be
./start.sh
```

This automated script will:

- Set up Docker PostgreSQL database
- Install dependencies
- Generate Prisma client
- Run database migrations
- Start the development server

### **Manual Setup (Alternative)**

1. **Clone the repository**

   ```bash
   git clone git@github.com:abdulhalimzhr/doel3d.git
   cd doel3d/be
   ```

2. **Choose environment**

   ```bash
   npm run env:dev        # Development environment
   # or
   npm run env:prod       # Production environment
   ```

3. **Start database**

   ```bash
   npm run db:start       # Start PostgreSQL with Docker
   ```

4. **Install dependencies**

   ```bash
   npm install
   ```

5. **Setup Prisma**

   ```bash
   npm run prisma:generate    # Generate client
   npm run prisma:deploy      # Run migrations
   ```

6. **Start application**
   ```bash
   npm run start:dev          # Development mode
   ```

## 🐳 Docker Database Management

### **Environment Management**

```bash
# Switch environments
npm run env:dev              # Development (doel3d_dev database)
npm run env:prod             # Production (doel3d_prod database)
npm run env:local            # Local/default (doel3d database)

# Check current environment
cat .env.docker
```

### **Database Operations**

```bash
# Core operations
npm run db:start             # Start PostgreSQL
npm run db:stop              # Stop PostgreSQL
npm run db:restart           # Restart PostgreSQL
npm run db:status            # Check status

# Data management
npm run db:backup            # Create backup
npm run db:logs              # View logs

# Database UI
npm run db:studio            # Prisma Studio (recommended)
npm run db:adminer           # Web-based admin UI (optional)
```

### **Data Persistence**

- **✅ Your data is permanent** - stored in Docker volumes
- **Survives**: Container restarts, computer reboots, Docker updates
- **Lost only if**: You run `npm run db:cleanup` (intentional data removal)

## 🎯 Access Points

- **Application**: http://localhost:3000
- **GraphQL Playground**: http://localhost:3000/graphql
- **Prisma Studio**: `npm run db:studio`
- **Adminer** (optional): http://localhost:8080

## 🛠️ Development Workflow

### **Daily Development**

```bash
# Morning startup
npm run env:dev              # Ensure dev environment
npm run db:start             # Start database
npm run start:dev            # Start application

# During development
npm run db:studio            # View/edit data
npm run prisma:migrate       # After schema changes

# End of day
npm run db:stop              # Stop database (data persists)
```

### **Environment Switching**

```bash
# Switch to development
npm run env:dev && npm run db:restart

# Switch to production
npm run env:prod && npm run db:restart

# Check what's running
npm run db:status
```

## 🎯 API Endpoints

The GraphQL API is available at `http://localhost:3000/graphql`

### **Key Queries & Mutations**

**Get uploaded files:**

```graphql
query {
  listUploadedFiles
}
```

**Estimate print cost:**

```graphql
mutation EstimateCost(
  $file: Upload!
  $settings: PrintSettingsInput!
) {
  estimatePrintCost(file: $file, settings: $settings) {
    filename
    volume
    weight
    materialCost
    timeInHours
    timeCost
    totalCost
  }
}
```

**Submit order:**

```graphql
mutation SubmitOrder($file: Upload!, $settings: CreateOrderInput!) {
  submitOrder(file: $file, settings: $settings) {
    orderId
    name
    email
    totalCost
    createdAt
  }
}
```

**Get order by ID:**

```graphql
query GetOrder($orderId: String!) {
  getOrder(orderId: $orderId) {
    orderId
    name
    email
    filename
    volume
    weight
    totalCost
    createdAt
  }
}
```

```graphql
query GetOrder($orderId: String!) {
  getOrder(orderId: $orderId) {
    orderId
    name
    email
    filename
    volume
    weight
    totalCost
    createdAt
  }
}
```

## 🏗️ Project Structure

```
doel3d/
├── be/                          # Backend (NestJS)
│   ├── src/
│   │   ├── app.module.ts        # Main application module
│   │   ├── main.ts              # Application entry point
│   │   ├── estimator/           # Cost estimation logic
│   │   ├── order/               # Order management
│   │   ├── upload/              # File upload handling
│   │   ├── prisma/              # Database service
│   │   ├── common/              # Shared utilities
│   │   └── utils/               # STL parsing utilities
│   ├── prisma/
│   │   ├── schema.prisma        # Database schema
│   │   └── migrations/          # Database migrations
│   ├── uploads/                 # Uploaded STL files
│   ├── docker-compose.yml       # PostgreSQL setup
│   ├── docker-manage.sh         # Database management script
│   ├── start.sh                 # Automated setup script
│   ├── switch-env.sh            # Environment switcher
│   ├── .env                     # Application environment
│   ├── .env.docker              # Active Docker environment
│   ├── .env.docker.dev          # Development template
│   ├── .env.docker.prod         # Production template
│   ├── DOCKER.md                # Docker documentation
│   ├── ENV-SETUP.md             # Environment setup guide
│   └── package.json
├── fe/                          # Frontend (Next.js) - In development
└── README.md
```

## 🔧 Configuration

### **Database Environments**

| Environment | Database      | User          | Use Case              |
| ----------- | ------------- | ------------- | --------------------- |
| Development | `doel3d_dev`  | `postgres`    | Local development     |
| Production  | `doel3d_prod` | `doel3d_user` | Production deployment |
| Local       | `doel3d`      | `postgres`    | Default/testing       |

### **Print Settings**

The system supports various print configuration options:

- **Layer Height**: 0.1mm - 0.3mm
- **Wall Count**: Number of perimeter walls
- **Top/Bottom Layers**: Number of solid layers
- **Infill Percentage**: 0% - 100%
- **Materials**: PLA (₹220/g) and PETG (₹350/g)
- **Nozzle Width**: Default 0.4mm
- **Print Speed**: Default 210mm/s

### **Cost Calculation**

The system calculates costs based on:

1. **Material Cost**: Volume × Density × Material Price
2. **Time Cost**: Print Time × ₹10,000/hour
3. **Total Cost**: Material Cost + Time Cost

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📝 Available Scripts

### **Application Scripts**

```bash
# Development
npm run start:dev           # Start with hot reload
npm run start:debug         # Start with debug mode
npm run start:prod          # Start production server
npm run build               # Build for production

# Code Quality
npm run lint                # Run ESLint
npm run format              # Format code with Prettier

# Development setup
npm run dev:setup           # Automated setup (./start.sh)
```

### **Database Scripts**

```bash
# Docker Management
npm run db:start            # Start PostgreSQL
npm run db:stop             # Stop PostgreSQL
npm run db:restart          # Restart PostgreSQL
npm run db:status           # Check status
npm run db:logs             # View logs
npm run db:backup           # Create backup

# Database UI
npm run db:studio           # Prisma Studio
npm run db:adminer          # Adminer web UI

# Environment Management
npm run env:dev             # Switch to development
npm run env:prod            # Switch to production
npm run env:local           # Switch to local/default
```

### **Prisma Scripts**

```bash
# Core operations
npm run prisma:generate     # Generate client
npm run prisma:migrate      # Create and apply migration
npm run prisma:deploy       # Deploy migrations
npm run prisma:reset        # Reset database (⚠️ data loss)
```

```bash
# View database
npx prisma studio

# Reset database
npx prisma migrate reset

# Deploy migrations
npx prisma migrate deploy

# Generate client
npx prisma generate
```

## 🚀 Deployment

### **Development Deployment**

```bash
# Automated setup
./start.sh

# Manual setup
npm run env:dev
npm run db:start
npm run start:dev
```

### **Production Deployment**

1. **Set up production environment**

   ```bash
   npm run env:prod
   # Update .env.docker.prod with secure passwords
   vim .env.docker.prod
   ```

2. **Build the application**

   ```bash
   npm run build
   ```

3. **Start production services**
   ```bash
   npm run db:start
   npm run prisma:deploy
   npm run start:prod
   ```

### **Environment Variables**

```bash
# Development
POSTGRES_DB=doel3d_dev
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres123

# Production (update with secure values)
POSTGRES_DB=doel3d_prod
POSTGRES_USER=doel3d_user
POSTGRES_PASSWORD=your-secure-password-here
```

## 🛠️ Troubleshooting

### **Common Issues**

**Database Connection Failed**

```bash
# Check if PostgreSQL is running
npm run db:status

# Restart database
npm run db:restart

# Check logs
npm run db:logs
```

**Port Already in Use**

```bash
# Check what's using port 5432
lsof -i :5432

# Change port in .env.docker
POSTGRES_PORT=5433
```

**Environment Issues**

```bash
# Check current environment
cat .env.docker

# Reset to development
npm run env:dev
```

**Data Recovery**

```bash
# Create backup before major changes
npm run db:backup

# Restore from backup
./docker-manage.sh restore backup_20250707_120000.sql
```

## 📚 Documentation

- **[Docker Setup Guide](be/DOCKER.md)** - Detailed Docker configuration
- **[Environment Setup](be/ENV-SETUP.md)** - Environment management guide
- **[GraphQL Playground](http://localhost:3000/graphql)** - API testing interface
- **[Prisma Studio](npm run db:studio)** - Database management UI

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the UNLICENSED License.

## 🔗 Links

- **Application**: http://localhost:3000
- **GraphQL Playground**: http://localhost:3000/graphql
- **Prisma Studio**: `npm run db:studio`
- **Adminer**: http://localhost:8080 (optional)
- **Repository**: https://github.com/abdulhalimzhr/doel3d
- **NestJS Documentation**: https://docs.nestjs.com/
- **Prisma Documentation**: https://www.prisma.io/docs/
- **GraphQL Documentation**: https://graphql.org/learn/

## 📞 Support

For support and questions:

- Open an issue in the [GitHub repository](https://github.com/abdulhalimzhr/doel3d/issues)
- Check the documentation files in the `be/` directory
- Review the troubleshooting section above

## 🎯 Development Status

- ✅ **Backend API** - Complete with GraphQL endpoints
- ✅ **Database** - PostgreSQL with Prisma ORM
- ✅ **STL Processing** - File upload and cost estimation
- ✅ **Order Management** - Create and retrieve orders
- ✅ **Docker Setup** - Containerized PostgreSQL
- ✅ **Environment Management** - Dev/prod configurations
- 🚧 **Frontend** - Next.js frontend in development
- 🚧 **Authentication** - User authentication system
- 🚧 **Payment Integration** - Payment processing
- 🚧 **Admin Dashboard** - Order management interface

---

**Built with ❤️ for the 3D printing community**
