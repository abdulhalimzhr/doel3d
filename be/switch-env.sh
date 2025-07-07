#!/bin/bash

# Environment switcher for DOEL 3D
# Usage: ./switch-env.sh [dev|prod|local]

ENV=${1:-dev}

case "$ENV" in
    "dev")
        echo "Switching to development environment..."
        cp .env.docker.dev .env.docker
        echo "Environment switched to development"
        echo "Database: doel3d_dev"
        ;;
    "prod")
        echo "Switching to production environment..."
        cp .env.docker.prod .env.docker
        echo "Environment switched to production"
        echo "⚠️  Remember to update the password in .env.docker.prod!"
        ;;
    "local"|"default")
        echo "Switching to local/default environment..."
        cat > .env.docker << EOF
# Docker environment variables
# Database Configuration
POSTGRES_DB=doel3d
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres123
POSTGRES_PORT=5432
EOF
        echo "Environment switched to local/default"
        echo "Database: doel3d"
        ;;
    *)
        echo "Usage: $0 [dev|prod|local]"
        echo ""
        echo "Available environments:"
        echo "  dev   - Development environment (doel3d_dev)"
        echo "  prod  - Production environment (doel3d_prod)"
        echo "  local - Local/default environment (doel3d)"
        exit 1
        ;;
esac

echo ""
echo "Current .env.docker contents:"
cat .env.docker
echo ""
echo "Don't forget to restart your services: ./docker-manage.sh restart"
