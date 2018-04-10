# Use an official Python runtime as a parent image
FROM redis:latest

# Set the working directory to /app
WORKDIR /app

# Use our own config
ADD ./redis.conf /app/redis.conf

CMD ["redis-server", "./redis.conf"]
