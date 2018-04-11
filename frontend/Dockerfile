# Use an official Python runtime as a parent image
FROM node:8

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
ADD ./mediaq/config /app/config
ADD ./mediaq/scripts /app/scripts
ADD ./mediaq/package.json /app/package.json

# Install any needed packages specified in requirements.txt
RUN npm install
# RUN npm install watch

# have to set this for watch to work...
# ENV TERM xterm

# compiles react files under node 8
CMD ["npm", "run", "docker"]
# CMD ["watch", "-n", "10", "npm", "run", "build"]
