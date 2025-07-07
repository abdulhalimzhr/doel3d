# DOEL 3D - STL Print Cost Calculator

A comprehensive 3D printing cost estimation platform built with modern web technologies. Upload STL files, configure print settings, and get accurate cost estimates for your 3D printing projects.

## 🚀 Tech Stack

- **Backend**: [NestJS](https://nestjs.com/) - Progressive Node.js framework
- **Database**: [Prisma](https://prisma.io/) ORM with PostgreSQL
- **API**: [GraphQL](https://graphql.org/) with Apollo Server
- **Frontend**: [Next.js](https://nextjs.org/) - React framework (in development)

## ✨ Features

- **STL File Upload**: Upload and parse STL files to extract volume and weight data
- **Cost Estimation**: Calculate material costs, printing time, and total costs
- **Material Support**: PLA and PETG material options with different pricing
- **Print Settings**: Configurable layer height, wall count, infill percentage, and more
- **Order Management**: Create and track printing orders with unique order IDs
- **GraphQL API**: Modern API with type-safe queries and mutations

## 📋 Prerequisites

- Node.js 18.0.0 or higher
- PostgreSQL database
- npm or yarn package manager

## 🛠️ Installation

### Backend Setup

1. **Clone the repository**

   ```bash
   git clone git@github.com:abdulhalimzhr/doel3d.git
   cd doel3d/be
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the `be` directory:

   ```bash
   DATABASE_URL="postgresql://username:password@localhost:5432/doel3d"
   PORT=3000
   ```

4. **Database Setup**

   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run migrations
   npx prisma migrate deploy

   # Or push schema for development
   npx prisma db push
   ```

5. **Start the development server**
   ```bash
   npm run start:dev
   ```

### Quick Start with Script

Alternatively, use the provided startup script:

```bash
cd be
chmod +x start.sh
./start.sh
```

This script will:

- Check system requirements
- Install dependencies
- Set up the database
- Generate Prisma client
- Start the development server

## 🎯 API Endpoints

The GraphQL API is available at `http://localhost:3000/graphql`

### Key Queries & Mutations

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

## 🏗️ Project Structure

```
doel3d/
├── be/                     # Backend (NestJS)
│   ├── src/
│   │   ├── app.module.ts   # Main application module
│   │   ├── main.ts         # Application entry point
│   │   ├── estimator/      # Cost estimation logic
│   │   ├── order/          # Order management
│   │   ├── upload/         # File upload handling
│   │   ├── prisma/         # Database service
│   │   ├── common/         # Shared utilities
│   │   └── utils/          # STL parsing utilities
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   └── migrations/     # Database migrations
│   ├── uploads/            # Uploaded STL files
│   └── package.json
├── fe/                     # Frontend (Next.js) - In development
└── README.md
```

## 🔧 Configuration

### Print Settings

The system supports various print configuration options:

- **Layer Height**: 0.1mm - 0.3mm
- **Wall Count**: Number of perimeter walls
- **Top/Bottom Layers**: Number of solid layers
- **Infill Percentage**: 0% - 100%
- **Materials**: PLA (₹220/g) and PETG (₹350/g)
- **Nozzle Width**: Default 0.4mm
- **Print Speed**: Default 210mm/s

### Cost Calculation

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

## 📝 Development

### Available Scripts

```bash
# Development
npm run start:dev      # Start with hot reload
npm run start:debug    # Start with debug mode

# Building
npm run build          # Build for production
npm run start:prod     # Start production server

# Code Quality
npm run lint           # Run ESLint
npm run format         # Format code with Prettier
```

### Database Operations

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

1. **Build the application**

   ```bash
   npm run build
   ```

2. **Set production environment variables**

   ```bash
   DATABASE_URL="your-production-database-url"
   PORT=3000
   ```

3. **Run migrations**

   ```bash
   npx prisma migrate deploy
   ```

4. **Start production server**
   ```bash
   npm run start:prod
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the UNLICENSED License.

## 🔗 Links

- **GraphQL Playground**: http://localhost:3000/graphql
- **Prisma Studio**: `npx prisma studio`
- **Documentation**: [NestJS Docs](https://docs.nestjs.com/)

## 📞 Support

For support and questions, please open an issue in the repository or contact the development team.
