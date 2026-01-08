#!/bin/bash
set -e

echo "Building base dependencies..."
docker compose build deps

echo "Starting all services..."
docker compose up --build

echo "Done! Services running."