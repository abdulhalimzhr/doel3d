#!/bin/bash

# DOEL3D - Full Stack Development Server Startup Script
# This script starts both the backend (NestJS) and frontend (Next.js) services

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
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

print_header() {
    echo -e "${CYAN}[DOEL3D]${NC} $1"
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if port is available
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 1  # Port is in use
    else
        return 0  # Port is available
    fi
}

# Function to kill process on port
kill_port() {
    local port=$1
    local pid=$(lsof -Pi :$port -sTCP:LISTEN -t 2>/dev/null)
    if [ ! -z "$pid" ]; then
        print_warning "Killing process on port $port (PID: $pid)"
        kill -9 $pid 2>/dev/null
        sleep 1
    fi
}

# Function to cleanup on exit
cleanup() {
    print_header "Shutting down services..."
    
    # Kill backend and frontend processes
    if [ ! -z "$BE_PID" ]; then
        print_status "Stopping backend server (PID: $BE_PID)"
        kill $BE_PID 2>/dev/null
    fi
    
    if [ ! -z "$FE_PID" ]; then
        print_status "Stopping frontend server (PID: $FE_PID)"
        kill $FE_PID 2>/dev/null
    fi
    
    # Clean up any remaining processes on the ports
    kill_port 3000
    kill_port 3001
    kill_port 3002
    kill_port 4000
    
    print_success "Services stopped successfully"
    exit 0
}

# Trap signals for cleanup
trap cleanup SIGINT SIGTERM

# Main function
main() {
    print_header "🚀 Starting DOEL3D Full Stack Development Environment"
    echo ""
    
    # Check prerequisites
    print_status "Checking prerequisites..."
    
    if ! command_exists node; then
        print_error "Node.js is not installed. Please install Node.js 18.0.0 or higher."
        exit 1
    fi
    
    if ! command_exists npm; then
        print_error "npm is not installed. Please install npm."
        exit 1
    fi
    
    if ! command_exists docker; then
        print_error "Docker is not installed. Please install Docker Desktop."
        exit 1
    fi
    
    print_success "Prerequisites check passed"
    echo ""
    
    # Check if we're in the correct directory
    if [ ! -d "be" ] || [ ! -d "fe" ]; then
        print_error "This script must be run from the root of the doel3d project"
        print_error "Expected directory structure:"
        print_error "  doel3d/"
        print_error "  ├── be/"
        print_error "  ├── fe/"
        print_error "  └── start-dev.sh"
        exit 1
    fi
    
    # Create logs directory if it doesn't exist
    mkdir -p logs
    
    # Clean up any existing processes on our ports
    print_status "Cleaning up existing processes..."
    kill_port 3000
    kill_port 3001
    kill_port 3002
    kill_port 4000
    
    # Start Backend
    print_header "🔧 Starting Backend Services"
    echo ""
    
    cd be
    
    # Check if backend dependencies are installed
    if [ ! -d "node_modules" ]; then
        print_status "Installing backend dependencies..."
        npm install
        if [ $? -ne 0 ]; then
            print_error "Failed to install backend dependencies"
            exit 1
        fi
    fi
    
    # Start database
    print_status "Starting PostgreSQL database..."
    ./docker-manage.sh start
    if [ $? -ne 0 ]; then
        print_error "Failed to start database"
        exit 1
    fi
    
    # Wait for database to be ready
    print_status "Waiting for database to be ready..."
    sleep 3
    
    # Generate Prisma client and run migrations
    print_status "Setting up database schema..."
    npx prisma generate
    npx prisma migrate deploy
    
    # Start backend server
    print_status "Starting NestJS backend server..."
    npm run start:dev > ../logs/backend.log 2>&1 &
    BE_PID=$!
    
    # Wait a moment for backend to start
    sleep 5
    
    # Check if backend is running
    if ! kill -0 $BE_PID 2>/dev/null; then
        print_error "Backend server failed to start"
        print_error "Check logs/backend.log for details"
        exit 1
    fi
    
    print_success "Backend server started (PID: $BE_PID)"
    
    cd ..
    
    # Start Frontend
    print_header "🎨 Starting Frontend Services"
    echo ""
    
    cd fe
    
    # Check if frontend dependencies are installed
    if [ ! -d "node_modules" ]; then
        print_status "Installing frontend dependencies..."
        npm install
        if [ $? -ne 0 ]; then
            print_error "Failed to install frontend dependencies"
            exit 1
        fi
    fi
    
    # Start frontend server
    print_status "Starting Next.js frontend server..."
    npm run dev > ../logs/frontend.log 2>&1 &
    FE_PID=$!
    
    # Wait a moment for frontend to start
    sleep 5
    
    # Check if frontend is running
    if ! kill -0 $FE_PID 2>/dev/null; then
        print_error "Frontend server failed to start"
        print_error "Check logs/frontend.log for details"
        exit 1
    fi
    
    print_success "Frontend server started (PID: $FE_PID)"
    
    cd ..
    
    # Display service information
    echo ""
    print_header "🎉 DOEL3D Development Environment Ready!"
    echo ""
    print_success "Services are running:"
    echo "  🔧 Backend (NestJS):     http://localhost:4000"
    echo "  📊 GraphQL Playground:  http://localhost:4000/graphql"
    echo "  🎨 Frontend (Next.js):  http://localhost:3000"
    echo "  🐘 PostgreSQL:          localhost:5432"
    echo "  🗄️  Database Admin:      http://localhost:8080 (run 'npm run db:adminer' in be/ folder)"
    echo ""
    print_status "Logs are being written to:"
    echo "  📝 Backend:  logs/backend.log"
    echo "  📝 Frontend: logs/frontend.log"
    echo ""
    print_warning "Press Ctrl+C to stop all services"
    echo ""
    
    # Monitor both processes
    while true; do
        # Check if backend is still running
        if ! kill -0 $BE_PID 2>/dev/null; then
            print_error "Backend server crashed!"
            print_error "Check logs/backend.log for details"
            cleanup
        fi
        
        # Check if frontend is still running
        if ! kill -0 $FE_PID 2>/dev/null; then
            print_error "Frontend server crashed!"
            print_error "Check logs/frontend.log for details"
            cleanup
        fi
        
        sleep 5
    done
}

# Check if script is being run directly
if [ "${BASH_SOURCE[0]}" == "${0}" ]; then
    main "$@"
fi
