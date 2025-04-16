# Set production environment for Docker
export ENVIRON=production
export NODE_ENV=production

shopt -s expand_aliases

if [ -e ~/.bash_aliases ]; then
    source ~/.bash_aliases
fi

# Check if production environment file exists
if [ ! -e "production.env" ]; then
    echo "No production environment found, creating..."
    touch production.env
    echo "NODE_ENV=production" >> production.env
    echo "Please paste your MONGODB URI:"
    read uri
    echo "MONGODB_URI=$uri" >> production.env
fi

export VERSION=$(git rev-parse --short HEAD)

# Start deployment
if [ "$1" == "true" ]; then
    docker-compose up -d --build
else
    docker-compose up --build
fi