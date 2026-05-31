# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG NODE_VERSION=24

################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-alpine AS base

# Set working directory for all build stages.
WORKDIR /app

########################################################################
# Copy and build front end assets
COPY ./public /app/public
COPY ./client /app/client
WORKDIR /app/client
RUN npm install
RUN npm run build

########################################################################
# Copy and prep server files in image
WORKDIR /app
COPY ./server /app
RUN npm install
RUN npm run build

# grant permissions to non-root user profile and switch user
RUN chown -R node /app/public
RUN chown -R node /app/dist
USER node

################################################################################
# Create a new stage to run the application with minimal runtime dependencies
# where the necessary files are copied from the build stage.
# FROM base as final

# Use production node environment by default.
# ENV NODE_ENV production

# Run the application as a non-root user.
# USER node

# Copy package.json so that package manager commands can be used.
# COPY package.json .

# Copy the production dependencies from the deps stage and also
# the built application from the build stage into the image.
# COPY --from=build /usr/src/app/public ./public
# COPY --from=build /usr/src/app/dist ./dist

# Expose the port that the application listens on.
EXPOSE 3000

# Run the application.
CMD npm run start
