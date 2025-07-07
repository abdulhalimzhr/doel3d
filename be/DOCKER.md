# Docker Setup for DOEL 3D Backend

This document describes how to set up and manage the PostgreSQL database using Docker for the DOEL 3D backend.

## Prerequisites

- Docker Desktop installed and running
- Docker Compose (usually included with Docker Desktop)

## Quick Start

1. **Start the database**:
   ```bash
   ./docker-manage.sh start
   ```

2. **Run the application**:
   ```bash
   ./start.sh
   ```

## Docker Services

### PostgreSQL Database
- **Container Name**: `doel3d-postgres`
- **Port**: `5432`
- **Database**: `doel3d`
- **Username**: `postgres`
- **Password**: `postgres123`

### Adminer (Database UI)
- **Container Name**: `doel3d-adminer`
- **Port**: `8080`
- **URL**: http://localhost:8080

## Management Commands

Use the `docker-manage.sh` script for database management:

```bash
# Start services
./docker-manage.sh start

# Stop services
./docker-manage.sh stop

# Restart services
./docker-manage.sh restart

# Check status
./docker-manage.sh status

# View logs
./docker-manage.sh logs
./docker-manage.sh logs postgres  # For specific service

# Backup database
./docker-manage.sh backup

# Restore database
./docker-manage.sh restore backup_20250707_120000.sql

# Clean up (removes all data)
./docker-manage.sh cleanup
```

## Manual Docker Commands

If you prefer using Docker commands directly:

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Connect to PostgreSQL container
docker exec -it doel3d-postgres psql -U postgres -d doel3d

# Backup database
docker exec doel3d-postgres pg_dump -U postgres -d doel3d > backup.sql

# Restore database
docker exec -i doel3d-postgres psql -U postgres -d doel3d < backup.sql
```

## Configuration Files

- `docker-compose.yml` - Docker services configuration
- `.env` - Application environment variables
- `.env.docker` - Docker-specific environment variables
- `init.sql` - Database initialization script

## Accessing the Database

### From the Application
The application automatically connects using the DATABASE_URL in `.env`:
```
DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/doel3d?schema=public"
```

### Using Adminer Web UI
1. Open http://localhost:8080
2. Select "PostgreSQL" as the system
3. Enter connection details:
   - Server: `postgres` (container name)
   - Username: `postgres`
   - Password: `postgres123`
   - Database: `doel3d`

### Using psql Client
```bash
# Install psql if not available
brew install postgresql  # macOS
sudo apt-get install postgresql-client  # Ubuntu

# Connect to database
PGPASSWORD=postgres123 psql -h localhost -p 5432 -U postgres -d doel3d
```

## Troubleshooting

### Port 5432 Already in Use
If you have a local PostgreSQL instance running:
```bash
# Stop local PostgreSQL (macOS with Homebrew)
brew services stop postgresql

# Or change the port in docker-compose.yml
ports:
  - "5433:5432"  # Use port 5433 instead
```

### Container Won't Start
```bash
# Check Docker is running
docker info

# Check logs for errors
./docker-manage.sh logs postgres

# Remove and recreate containers
./docker-manage.sh cleanup
./docker-manage.sh start
```

### Data Persistence
Database data is stored in a Docker volume named `postgres_data`. This persists between container restarts but will be lost if you run `cleanup`.

## Production Considerations

For production deployment:

1. **Change default passwords** in `.env.docker`
2. **Use environment-specific configuration**
3. **Set up regular backups**
4. **Configure proper networking and security**
5. **Use managed database services** for better reliability

Example production environment variables:
```bash
POSTGRES_DB=doel3d_prod
POSTGRES_USER=doel3d_user
POSTGRES_PASSWORD=your-secure-password
DATABASE_URL="postgresql://doel3d_user:your-secure-password@your-db-host:5432/doel3d_prod"
```
