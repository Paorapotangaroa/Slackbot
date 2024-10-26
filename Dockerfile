# Use an official Node.js image from the Docker Hub
FROM node:18-alpine

# Install tzdata for timezone information
RUN apk add --no-cache tzdata

# Set the timezone to America/Denver (Utah) so that the TA dates come in the correct time format
# CHANGE THIS LINE FOR OTHER TIME ZONES
ENV TZ=America/Denver

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available) to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install

RUN 

# Copy the rest of the application code into the working directory
COPY . .

# Expose the port your app will run on (optional; adjust if needed)
EXPOSE 3000

# Command to run your application
CMD ["node", "index.js"]
