# Set production environment for Docker
export ENVIRON=production

# Check if production environment file exists
if [ ! -e "production.env" ]; then
    echo "No production environment found, creating..."
    touch production.env
    echo "NODE_ENV=production" >> production.env
    echo "Please paste your MONGODB URI:"
    read uri
    echo "MONGODB_URI=$uri" >> production.env
fi

# Start deployment
docker-compose up