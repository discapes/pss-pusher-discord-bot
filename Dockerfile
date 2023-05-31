FROM node:18
RUN npm i -g pnpm

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY pnpm-lock.yaml ./

# RUN npm install
# If you are building your code for production
RUN pnpm install --frozen-lockfile
# Bundle app source
COPY . .

RUN pnpm run build

# EXPOSE 8080
CMD [ "pnpm", "start" ]