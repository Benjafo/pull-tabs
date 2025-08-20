#!/bin/sh

echo "Starting production build process..."
echo "Environment check:"
echo "PORT: ${PORT}"
echo "VITE_API_URL: ${VITE_API_URL}"

echo "Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "Build failed!"
    exit 1
fi

echo "Build completed successfully"
echo "Checking dist folder..."
ls -la dist/

echo "Starting server..."
npm run start