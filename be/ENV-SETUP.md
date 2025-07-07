# Environment Configuration Guide

This guide explains how to configure database credentials using environment variables for different environments.

## 🔧 Environment Files

### `.env.docker` - Active Docker Configuration
This file is used by Docker Compose and contains the current database configuration.

### `.env.docker.dev` - Development Template
```bash
POSTGRES_DB=doel3d_dev
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres123
POSTGRES_PORT=5432
```

### `.env.docker.prod` - Production Template
```bash
POSTGRES_DB=doel3d_prod
POSTGRES_USER=doel3d_user
POSTGRES_PASSWORD=your-secure-password-here
POSTGRES_PORT=5432
```

### `.env` - Application Configuration
Contains the DATABASE_URL and application settings. This file uses variables that reference the Docker configuration.

## 🚀 Quick Start

### Switch Environments
```bash
# Development environment
npm run env:dev
# or
./switch-env.sh dev

# Production environment
npm run env:prod
# or
./switch-env.sh prod

# Local/default environment
npm run env:local
# or
./switch-env.sh local
```

### Start Services
```bash
# Restart services after environment switch
npm run db:restart

# Or start fresh
npm run db:start
```

## 🔐 Security Best Practices

### Development
- Use simple passwords for local development
- Keep development credentials in version control (templates)

### Production
1. **Never commit production passwords**
2. **Use strong passwords** (minimum 16 characters)
3. **Consider using Docker secrets** for sensitive data
4. **Rotate passwords regularly**

### Example Production Setup
```bash
# Generate a strong password
openssl rand -base64 32

# Update .env.docker.prod with the new password
vim .env.docker.prod

# Switch to production environment
npm run env:prod

# Update the main .env file to match
vim .env
```

## 📁 File Structure

```
be/
├── .env                    # Application environment (DATABASE_URL, etc.)
├── .env.docker             # Active Docker configuration (gitignored)
├── .env.docker.dev         # Development template (tracked)
├── .env.docker.prod        # Production template (tracked)
├── docker-compose.yml      # Uses variables from .env.docker
└── switch-env.sh           # Environment switcher script
```

## 🔄 Environment Variables

### Docker Variables (in .env.docker)
- `POSTGRES_DB` - Database name
- `POSTGRES_USER` - Database username
- `POSTGRES_PASSWORD` - Database password
- `POSTGRES_PORT` - Database port (default: 5432)

### Application Variables (in .env)
- `DATABASE_URL` - Full PostgreSQL connection string
- `PORT` - Application port (default: 3000)
- `NODE_ENV` - Environment mode (development/production)

## 🛠️ Commands Reference

### Environment Management
```bash
npm run env:dev              # Switch to development
npm run env:prod             # Switch to production
npm run env:local            # Switch to local/default

./switch-env.sh dev          # Alternative syntax
```

### Database Management
```bash
npm run db:start             # Start PostgreSQL
npm run db:stop              # Stop PostgreSQL
npm run db:restart           # Restart PostgreSQL
npm run db:status            # Check status
npm run db:backup            # Create backup
npm run db:studio            # Open Prisma Studio
```

### Development Workflow
```bash
# 1. Switch to development environment
npm run env:dev

# 2. Start database
npm run db:start

# 3. Run migrations
npm run prisma:migrate

# 4. Start application
npm run start:dev
```

## 🔍 Troubleshooting

### Environment Not Loading
```bash
# Check current environment
cat .env.docker

# Verify environment is loaded
./docker-manage.sh start
# Should show the correct database name, user, etc.
```

### Database Connection Issues
```bash
# Test connection with current environment
npm run db:status

# Check Docker logs
npm run db:logs

# Verify DATABASE_URL matches Docker config
grep DATABASE_URL .env
```

### Password Authentication Failed
1. Ensure `.env` and `.env.docker` have matching credentials
2. Restart Docker services after changing passwords
3. Check for special characters that need escaping in URLs

### Migration Issues
```bash
# Reset database (WARNING: data loss)
npm run prisma:reset

# Or manually reset
npm run db:stop
docker volume rm doel3d_postgres_data
npm run db:start
npm run prisma:migrate
```

## 🚀 Deployment Considerations

### For Production Deployments
1. **Use environment-specific credentials**
2. **Set strong passwords**
3. **Use managed database services** when possible
4. **Enable SSL/TLS** for database connections
5. **Set up monitoring and backups**

### Example Production DATABASE_URL
```bash
# For managed PostgreSQL (like AWS RDS)
DATABASE_URL="postgresql://username:password@your-db-host:5432/doel3d_prod?sslmode=require"

# For Docker in production
DATABASE_URL="postgresql://doel3d_user:strong-password@localhost:5432/doel3d_prod?schema=public"
```

### Environment Variables in CI/CD
```yaml
# GitHub Actions example
env:
  POSTGRES_DB: doel3d_test
  POSTGRES_USER: postgres
  POSTGRES_PASSWORD: ${{ secrets.DB_PASSWORD }}
  DATABASE_URL: postgresql://postgres:${{ secrets.DB_PASSWORD }}@localhost:5432/doel3d_test
```
