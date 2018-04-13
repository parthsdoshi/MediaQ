# Use an official Redis runtime as a parent image
FROM redis:latest

# Set the working directory to /app
WORKDIR /app

# Use our own config
ADD ./redis.conf /app/redis.conf

CMD ["redis-server", "/app/redis.conf"]
