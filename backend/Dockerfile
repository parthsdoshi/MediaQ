# Use an official Python runtime as a parent image
FROM python:3.7.10

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
ADD ./Dockerfile /app/Dockerfile
ADD ./requirements.txt /app/requirements.txt

# Install any needed packages specified in requirements.txt
RUN pip install --trusted-host pypi.python.org -r requirements.txt

# Make port 80 available to the world outside this container
# EXPOSE 80

# Define environment variable
# ENV NAME MediaQWorld

# Run app.py when the container launches
CMD ["python", "app.py"]
