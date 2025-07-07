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

# Function to load environment variables
load_env() {
    if [ -f ".env.docker" ]; then
        export $(grep -v '^#' .env.docker | xargs)
    fi
    
    # Set defaults if not provided
    export POSTGRES_DB=${POSTGRES_DB:-doel3d}
    export POSTGRES_USER=${POSTGRES_USER:-postgres}
    export POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-postgres123}
    export POSTGRES_PORT=${POSTGRES_PORT:-5432}
}

# Function to check if PostgreSQL is running
check_postgres() {
    load_env
    if command_exists psql; then
        if PGPASSWORD=$POSTGRES_PASSWORD pg_isready -h localhost -p $POSTGRES_PORT -U $POSTGRES_USER >/dev/null 2>&1; then
            return 0
        else
            return 1
        fi
    else
        return 1
    fi
}

# Check if Docker is installed and running
check_docker() {
    if ! command_exists docker; then
        print_error "Docker is not installed. Please install Docker Desktop first."
        return 1
    fi
    
    if ! docker info >/dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker Desktop and try again."
        return 1
    fi
    
    return 0
}

# Function to start services
start_services() {
    load_env
    print_status "Starting PostgreSQL service..."
    
    if ! check_docker; then
        return 1
    fi
    
    docker-compose up -d postgres
    
    if [ $? -eq 0 ]; then
        print_success "PostgreSQL started successfully!"
        print_status "PostgreSQL is available at: localhost:$POSTGRES_PORT"
        print_status ""
        print_status "Database connection details:"
        print_status "  Host: localhost"
        print_status "  Port: $POSTGRES_PORT"
        print_status "  Database: $POSTGRES_DB"
        print_status "  Username: $POSTGRES_USER"
        print_status "  Password: $POSTGRES_PASSWORD"
        print_status ""
        print_status "To access database UI:"
        print_status "  Prisma Studio: npm run db:studio"
        print_status "  Or start Adminer: ./docker-manage.sh adminer"
    else
        print_error "Failed to start PostgreSQL"
        return 1
    fi
}

# Function to start Adminer
start_adminer() {
    print_status "Starting Adminer (Database Web UI)..."
    
    if ! check_docker; then
        return 1
    fi
    
    docker-compose -f docker-compose.adminer.yml up -d
    
    if [ $? -eq 0 ]; then
        print_success "Adminer started successfully!"
        print_status "Adminer is available at: http://localhost:8080"
    else
        print_error "Failed to start Adminer"
        return 1
    fi
}

# Function to stop Adminer
stop_adminer() {
    print_status "Stopping Adminer..."
    docker-compose -f docker-compose.adminer.yml down
    print_success "Adminer stopped"
}

# Function to stop services
stop_services() {
    print_status "Stopping services..."
    docker-compose down
    print_success "Services stopped"
}

# Function to restart services
restart_services() {
    print_status "Restarting services..."
    docker-compose restart
    print_success "Services restarted"
}

# Function to show service status
show_status() {
    print_status "Service status:"
    docker-compose ps
}

# Function to show logs
show_logs() {
    if [ -n "$1" ]; then
        docker-compose logs -f "$1"
    else
        docker-compose logs -f
    fi
}

# Function to clean up (remove containers and volumes)
cleanup() {
    print_warning "This will remove all containers and volumes (including data)!"
    read -p "Are you sure? (y/N): " confirm
    
    if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
        docker-compose down -v --remove-orphans
        docker system prune -f
        print_success "Cleanup completed"
    else
        print_status "Cleanup cancelled"
    fi
}

# Function to backup database
backup_db() {
    load_env
    local backup_file="backup_$(date +%Y%m%d_%H%M%S).sql"
    print_status "Creating database backup: $backup_file"
    
    docker exec doel3d-postgres pg_dump -U $POSTGRES_USER -d $POSTGRES_DB > "$backup_file"
    
    if [ $? -eq 0 ]; then
        print_success "Database backup created: $backup_file"
    else
        print_error "Failed to create database backup"
    fi
}

# Function to restore database
restore_db() {
    if [ -z "$1" ]; then
        print_error "Please provide backup file path"
        print_status "Usage: $0 restore <backup_file.sql>"
        return 1
    fi
    
    if [ ! -f "$1" ]; then
        print_error "Backup file not found: $1"
        return 1
    fi
    
# Function to restore database
restore_db() {
    load_env
    if [ -z "$1" ]; then
        print_error "Please provide backup file path"
        print_status "Usage: $0 restore <backup_file.sql>"
        return 1
    fi
    
    if [ ! -f "$1" ]; then
        print_error "Backup file not found: $1"
        return 1
    fi
    
    print_warning "This will replace all data in the database!"
    read -p "Are you sure? (y/N): " confirm
    
    if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
        docker exec -i doel3d-postgres psql -U $POSTGRES_USER -d $POSTGRES_DB < "$1"
        print_success "Database restored from: $1"
    else
        print_status "Restore cancelled"
    fi
}
}

# Main script logic
case "$1" in
    "start")
        start_services
        ;;
    "stop")
        stop_services
        ;;
    "restart")
        restart_services
        ;;
    "status")
        show_status
        ;;
    "logs")
        show_logs "$2"
        ;;
    "adminer")
        start_adminer
        ;;
    "stop-adminer")
        stop_adminer
        ;;
    "cleanup")
        cleanup
        ;;
    "backup")
        backup_db
        ;;
    "restore")
        restore_db "$2"
        ;;
    *)
        echo "DOEL 3D Docker Management Script"
        echo ""
        echo "Usage: $0 {start|stop|restart|status|logs|adminer|stop-adminer|cleanup|backup|restore}"
        echo ""
        echo "Commands:"
        echo "  start        - Start PostgreSQL service"
        echo "  stop         - Stop all services"
        echo "  restart      - Restart all services"
        echo "  status       - Show service status"
        echo "  logs         - Show logs (optionally for specific service)"
        echo "  adminer      - Start Adminer web UI (optional)"
        echo "  stop-adminer - Stop Adminer web UI"
        echo "  cleanup      - Remove containers and volumes (WARNING: data loss)"
        echo "  backup       - Create database backup"
        echo "  restore      - Restore database from backup file"
        echo ""
        echo "Examples:"
        echo "  $0 start"
        echo "  $0 adminer             # Start web database UI"
        echo "  $0 logs postgres"
        echo "  $0 restore backup_20250707_120000.sql"
        echo ""
        echo "Database UI Options:"
        echo "  Prisma Studio: npm run db:studio (recommended)"
        echo "  Adminer:       $0 adminer (if you prefer web UI)"
        ;;
esac
