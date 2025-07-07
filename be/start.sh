#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if PostgreSQL is running
check_postgres() {
    if command_exists psql; then
        if pg_isready >/dev/null 2>&1; then
            return 0
        else
            return 1
        fi
    else
        return 1
    fi
}

# Main script
print_status "Starting DOEL 3D Backend Setup..."

# Check if we're in the correct directory
if [ ! -f "package.json" ] || [ ! -d "src" ] || [ ! -f "prisma/schema.prisma" ]; then
    print_error "This script must be run from the backend project root directory!"
    exit 1
fi

# Check if Node.js is installed
if ! command_exists node; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command_exists npm; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2)
REQUIRED_VERSION="18.0.0"
if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    print_warning "Node.js version $NODE_VERSION detected. Version 18+ is recommended."
fi

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    print_warning "DATABASE_URL environment variable is not set."
    print_status "Please set your DATABASE_URL. Example:"
    echo "export DATABASE_URL=\"postgresql://username:password@localhost:5432/doel3d\""
    
    # Prompt user for database URL
    read -p "Enter your DATABASE_URL (or press Enter to use default local setup): " user_db_url
    
    if [ -n "$user_db_url" ]; then
        export DATABASE_URL="$user_db_url"
    else
        print_status "Using default local PostgreSQL setup..."
        export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/doel3d"
    fi
fi

print_status "Using DATABASE_URL: $DATABASE_URL"

# Check PostgreSQL connection
print_status "Checking PostgreSQL connection..."
if ! check_postgres; then
    print_warning "PostgreSQL is not running or not accessible."
    print_status "Please ensure PostgreSQL is installed and running."
    print_status "On macOS with Homebrew: brew services start postgresql"
    print_status "On Ubuntu/Debian: sudo service postgresql start"
    
    read -p "Do you want to continue anyway? (y/N): " continue_anyway
    if [ "$continue_anyway" != "y" ] && [ "$continue_anyway" != "Y" ]; then
        exit 1
    fi
fi

# Install dependencies
print_status "Installing npm dependencies..."
if npm install; then
    print_success "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Generate Prisma client
print_status "Generating Prisma client..."
if npx prisma generate; then
    print_success "Prisma client generated successfully"
else
    print_error "Failed to generate Prisma client"
    exit 1
fi

# Run database migrations
print_status "Running database migrations..."
if npx prisma migrate deploy; then
    print_success "Database migrations completed successfully"
else
    print_warning "Database migrations failed. Trying to push schema instead..."
    if npx prisma db push; then
        print_success "Database schema pushed successfully"
    else
        print_error "Failed to update database schema"
        print_status "You may need to create the database manually or check your DATABASE_URL"
    fi
fi

# Optional: Seed database (if seed script exists)
if grep -q '"seed"' package.json; then
    print_status "Found seed script. Running database seeding..."
    if npm run seed; then
        print_success "Database seeded successfully"
    else
        print_warning "Database seeding failed or no data to seed"
    fi
fi

# Build the application
print_status "Building the application..."
if npm run build; then
    print_success "Application built successfully"
else
    print_warning "Build failed, but continuing with development mode..."
fi

# Start the development server
print_status "Starting NestJS development server..."
print_success "Application is starting up..."
print_status "The server will be available at: http://localhost:3000"
print_status "GraphQL Playground will be available at: http://localhost:3000/graphql"
print_status ""
print_status "Press Ctrl+C to stop the server"
print_status "========================================="

# Start in development mode with watch
npm run start:dev
