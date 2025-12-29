#!/bin/bash

echo "Starting Up-Site Docker Stack"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "Error: .env file not found in root directory"
    echo "Please create a .env file with required environment variables"
    exit 1
fi

echo "Found .env file"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "Error: Docker is not running"
    echo "Please start Docker and try again"
    exit 1
fi

echo "Docker is running"
echo ""

# Build images
echo "📦 Building Docker images..."
docker-compose build

if [ $? -ne 0 ]; then
    echo "Build failed"
    exit 1
fi

echo "Build successful"
echo ""

# Start services
echo "Starting services..."
docker-compose up -d

if [ $? -ne 0 ]; then
    echo "Failed to start services"
    exit 1
fi

echo ""
echo "All services started successfully!"
echo ""
echo "Service Status:"
docker-compose ps
echo ""
echo "Access your application at:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:8080"
echo ""
echo "View logs: docker-compose logs -f"
echo "Stop services: docker-compose down"
