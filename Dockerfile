FROM node:16.17.0

# Create app directory, this is in our container/in our image
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

RUN npm run build


ARG APP_PORT
ENV APP_PORT $APP_PORT

EXPOSE $APP_PORT

CMD [ "node", "dist/main" ]
