# DOEL3D Development Troubleshooting Guide

## Common Issues and Solutions

### 🔧 Startup Script Issues

#### Script not executable (Unix/Linux/macOS)
```bash
chmod +x start-dev.sh
```

#### Port already in use
```bash
# Kill processes on ports 3000, 4000
lsof -ti:3000 | xargs kill -9
lsof -ti:4000 | xargs kill -9

# Then restart
./start-dev.sh
```

#### Database connection errors
```bash
# Check if Docker is running
docker info

# Restart database
cd be
npm run db:restart

# Check database status
npm run db:status
```

### 🐳 Docker Issues

#### Docker not running
- Make sure Docker Desktop is installed and running
- Check system tray (Windows) or menu bar (macOS) for Docker icon

#### PostgreSQL port conflicts
```bash
# Stop any existing PostgreSQL services
sudo service postgresql stop  # Linux
brew services stop postgresql  # macOS

# Or change port in docker-compose.yml
```

### 📦 Dependencies Issues

#### Node.js version mismatch
- Ensure Node.js 18.0.0 or higher is installed
- Use nvm to manage Node.js versions:
```bash
nvm install 18
nvm use 18
```

#### npm install fails
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### 🔄 Database Issues

#### Prisma schema out of sync
```bash
cd be
npx prisma generate
npx prisma db push
```

#### Database migration errors
```bash
cd be
npx prisma migrate reset
npx prisma migrate deploy
```

### 🌐 Frontend Issues

#### Next.js build errors
```bash
cd fe
rm -rf .next
npm run build
```

#### Styling issues
```bash
cd fe
npm install --force
```

### 📊 Backend Issues

#### GraphQL schema errors
```bash
cd be
npm run build
```

#### NestJS compilation errors
```bash
cd be
rm -rf dist
npm run build
```

### 📝 Logs and Debugging

#### Check application logs
```bash
# View logs in real-time
tail -f logs/backend.log
tail -f logs/frontend.log

# Or view specific number of lines
tail -n 100 logs/backend.log
```

#### Enable debug mode
```bash
# Backend debug
cd be
npm run start:debug

# Frontend debug
cd fe
npm run dev -- --inspect
```

### 🔍 Quick Health Check

Run this to check if everything is working:

```bash
# Check if services are running
curl http://localhost:4000/health  # Backend health
curl http://localhost:3000         # Frontend

# Check database connection
cd be
npm run db:status
```

### 🆘 Reset Everything

If nothing works, try a complete reset:

```bash
# Stop all services
./start-dev.sh  # Press Ctrl+C to stop

# Clean everything
npm run clean

# Reset database
cd be
npm run db:stop
docker system prune -f
npm run db:start

# Reinstall dependencies
cd ..
npm run install:all

# Start again
./start-dev.sh
```

### 📞 Getting Help

If you're still having issues:

1. Check the logs in `logs/` directory
2. Ensure all prerequisites are installed
3. Try the reset procedure above
4. Create an issue on GitHub with:
   - Your operating system
   - Node.js version (`node --version`)
   - npm version (`npm --version`)
   - Docker version (`docker --version`)
   - Error messages from logs

### 🔗 Useful Commands

```bash
# System info
node --version
npm --version
docker --version

# Process monitoring
ps aux | grep node     # Check running Node processes
netstat -tulpn | grep :3000  # Check port 3000
netstat -tulpn | grep :4000  # Check port 4000

# Docker debugging
docker ps              # List running containers
docker logs <container_id>  # View container logs
```
