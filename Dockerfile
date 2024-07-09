# Set the base image
FROM node:18

WORKDIR /app

COPY package*.json yarn.lock ./

# Install the application dependencies
RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

EXPOSE 8081

# Start the application
CMD [ "yarn", "start" ]